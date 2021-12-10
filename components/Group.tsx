import { Disclosure, Transition } from '@headlessui/react'
import { ChevronRightIcon } from '@heroicons/react/solid'
import { prettyPrintJson } from 'pretty-print-json'
import { FC } from 'react'

import type { RulesAndApps } from '../util/types'

type GroupType = {
  data: RulesAndApps[]
}

const Group: FC<GroupType> = ({ data }) => {
  let title = ''
  if (data.length === 1) {
    title = 'Single app: ' + data[0].app.label
  } else {
    title = data
      .map((item) => item.app.label)
      .slice(0, 3)
      .join(', ')
    if (data.length > 3) {
      title += ' + ' + (data.length - 3) + ' more'
    }
  }

  return (
    <div className="mt-2 mb-6 overflow-hidden bg-white rounded-lg shadow-sm shadow-blue-500">
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex justify-between w-full px-4 py-5 text-left border-b border-blue-200">
              <div>
                <h3 className="text-base font-medium leading-6 text-gray-900">
                  {title}
                </h3>
              </div>
              <div className="flex-shrink-0">
                <ChevronRightIcon
                  className={`h-4 ${
                    open ? 'transform -rotate-90' : 'transform rotate-90'
                  }`}
                />
              </div>
            </Disclosure.Button>
            <Transition
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0">
              <Disclosure.Panel className="px-4 pt-3 pb-4">
                <h3 className="p-0 mb-2 text-sm">Exact policy contents:</h3>
                <div
                  className="p-4 mb-3 font-mono text-xs rounded-md bg-blue-50"
                  dangerouslySetInnerHTML={{
                    __html: prettyPrintJson.toHtml(data[0].rules)
                  }}
                />
                <h3 className="p-0 mb-2 text-sm">
                  {data.length > 1 && data.length + ' matching apps:'}
                </h3>
                {data.map((row) => {
                  return (
                    <div
                      key={row.app.id}
                      className="relative flex items-start ml-1">
                      <div className="flex items-center py-1">
                        <input
                          id={row.app.id}
                          name={row.app.id}
                          type="checkbox"
                          className="w-4 h-4 mr-2 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label
                          htmlFor={row.app.id}
                          className="top-0 inline-block w-32 overflow-hidden text-xs font-medium text-black whitespace-nowrap text-ellipsis">
                          {row.app.name}
                        </label>
                        <span className="text-xs text-gray-700">
                          {row.app.label}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>
    </div>
  )
}

export default Group
