import type { NextApiRequest, NextApiResponse } from 'next'
import objectHash from 'object-hash'

import oktaFetch from '../../util/fetch'
import type {
  AppsQuery,
  GroupedResults,
  RulesAndApps,
  RulesQuery
} from '../../util/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // It's important to look in `req.body` (vs `req.query`) because
  // we want to send the API key and URL via POST, so they're not
  // exposed in server logs or other places.
  if (!req.body.apiKey || typeof req.body.apiKey !== 'string') {
    res.status(400).send('missing API key')
  } else if (!req.body.url || typeof req.body.url !== 'string') {
    res.status(400).send('missing url')
  } else {
    // Standard API query to return all apps in the org.
    const data = await oktaFetch<AppsQuery>(
      req.body.url + '/api/v1/apps',
      req.body.apiKey
    )

    if ((data as any).errorCode) {
      return res.status(500).json(data)
    }

    // For each app, prepare a follow-up query to `_links.accessPolicy.href`
    // and add `/rules`, so /policies/rst0000123 becomes /policies/rst0000123/rules.
    const promises = data.map(
      (app) =>
        new Promise<RulesAndApps>((resolve) => {
          oktaFetch<RulesQuery>(
            app._links.accessPolicy.href + '/rules',
            req.body.apiKey
          ).then((data) =>
            // When we get the results from `/rules`, create a new object for
            // the app, containing a reference to the app data (in `app`),
            // and a reference to the accessPolicy rules in `rules`.
            //
            // Then, MD5 the `rules` so we can group by unique values for the UI.
            resolve({
              app: app,
              rules: data[0].actions.appSignOn,
              hash: objectHash.MD5(data[0].actions.appSignOn)
            })
          )
        })
    )

    // Run all of the prepared queries
    //
    // NOTE: This will likely run up against rate limits, and probably even
    // memory limits for orgs with very large Apps catalogs.
    //
    // Eventually, we may want to back-off or stagger requests or something
    // that requires more engineering prowess than a PM has :)
    const results = (await Promise.allSettled(promises))
      .filter((result) => result.status === 'fulfilled')
      .reduce((acc, curr) => {
        if (curr.status === 'fulfilled') {
          const { hash, ...contents } = curr.value
          const returnValue = {
            ...acc,
            [hash]: [...(acc[hash] || []), contents] as RulesAndApps[]
          }
          return returnValue
        } else {
          return acc
        }
      }, {} as GroupedResults)

    res.status(200).json(results)
  }
}
