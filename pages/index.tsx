import {
  ExclamationCircleIcon,
  GlobeAltIcon,
  KeyIcon
} from '@heroicons/react/solid'
import type { NextPage } from 'next'
import { prettyPrintJson } from 'pretty-print-json'
import { useState } from 'react'

import Group from '../components/Group'
import { GroupedResults } from '../util/types'

type ErrorType = {
  [key: string]: string
}

const Home: NextPage = () => {
  const server = useState(process.env.NEXT_PUBLIC_API_SERVER)
  const apiKey = useState(process.env.NEXT_PUBLIC_API_KEY)
  const [results, setResults] = useState<GroupedResults>()
  const [error, setError] = useState<ErrorType>({})

  const getErrorFor = (key: string) => error[key]
  const setErrorFor = (key: string, error: string) => {
    setError((previousError) => {
      return { ...previousError, [key]: error }
    })
  }

  const inputs = [
    {
      title: 'Server',
      icon: <GlobeAltIcon className="w-5 h-5" aria-hidden="true" />,
      type: 'url',
      storage: server,
      validation: (value: string) => {
        try {
          const input = new URL(
            !value.startsWith('http') ? 'https://' + value : value
          )
          if (input.protocol !== 'https:') throw 'must be https'
          if (input.host === '') throw 'invalid url'
          return 'https://' + input.hostname
        } catch (e) {
          throw typeof e === 'string' ? e : 'invalid url'
        }
      }
    },
    {
      title: 'API Key',
      icon: <KeyIcon className="w-5 h-5" aria-hidden="true" />,
      type: 'text',
      storage: apiKey,
      validation: (value: string) => {
        if (value.length < 10) {
          throw 'invalid key'
        } else {
          return value
        }
      }
    }
  ]

  const updateTable = () => {
    fetch('/api/okta', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: server[0],
        apiKey: apiKey[0]
      })
    }).then((response) => {
      response.json().then((results) => {
        if (results.errorCode) {
          setError({ global: results })
        } else {
          setError({})
          setResults(results)
        }
      })
    })

    return true
  }

  return (
    <>
      <div className="min-h-full">
        <div className="pb-32 bg-blue-700">
          <div className="px-12 mx-auto max-w-7xl">
            <header>
              <h1 className="pt-6 text-2xl font-bold text-white">
                Consolidation POC
              </h1>
            </header>
            <div className="relative flex items-center justify-between py-6">
              <div className="flex justify-around flex-1 space-x-12">
                {inputs.map((input, idx) => {
                  const [getter, setter] = input.storage

                  return (
                    <div className="flex-grow" key={'inputgroup_' + idx}>
                      <div className="relative text-gray-400 focus-within:text-gray-600">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          {input.icon}
                        </div>
                        <input
                          id={input.title}
                          className="block w-full py-2 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-500 bg-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white focus:border-white"
                          placeholder={input.title}
                          type="text"
                          value={getter}
                          name={input.title}
                          onChange={(e) => {
                            setter(e.target.value)
                          }}
                          onFocus={() => setErrorFor(input.title, '')}
                          onBlur={(e) => {
                            console.log(e)
                            try {
                              const value = e.currentTarget.value || ''
                              const result = input.validation(value)
                              if (result) {
                                e.currentTarget.value = result
                                setter(result)
                              }
                            } catch (e) {
                              setErrorFor(input.title, e as string)
                            }
                          }}
                        />
                        {getErrorFor(input.title) && (
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <span className="flex items-center pl-2 text-xs text-white bg-red-500 rounded-md">
                              {getErrorFor(input.title)}
                              <ExclamationCircleIcon
                                className="w-5 h-5 py-1 mr-1 text-white"
                                aria-hidden="true"
                              />
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <main className="-mt-32">
          <div className="px-12 pb-12 mx-auto max-w-7xl">
            <div className="px-5 py-6 bg-white rounded-lg shadow">
              <button
                onClick={updateTable}
                type="button"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Get app list
              </button>
              {error.global && (
                <div className="p-6 mt-6 text-sm font-medium text-red-600 bg-red-100 rounded-md">
                  <strong>There was an error with the API:</strong>
                  <pre
                    dangerouslySetInnerHTML={{
                      __html: prettyPrintJson.toHtml(error.global)
                    }}
                  />
                </div>
              )}
              {results &&
                Object.entries(results).map(([hash, entry]) => (
                  <Group key={hash} data={entry} />
                ))}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

// return (
//   <Layout>
//     {table.map((row) => {
//       console.log(row)
//       return <GroupedTable key={row[0]} data={row[1]} />
//     })}
//   </Layout>
// )

export default Home
