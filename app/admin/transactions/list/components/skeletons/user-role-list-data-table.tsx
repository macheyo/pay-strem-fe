// "use client";

import React from "react";

export const UserRoleListDataTableSkeleton = () => {
  const skeletonRows = Array.from({ length: 10 }, (_, i) => i + 1); // Create 10 skeleton rows

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="w-full">
        <div className="flex items-center justify-between p-2">
          <div className="h-8 w-24 animate-pulse rounded-md bg-gray-700"></div>
          <div className="h-8 w-12 animate-pulse rounded-md bg-gray-700"></div>
        </div>
        <div className="w-full">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left">
                <th className="h-8 animate-pulse rounded-md bg-gray-700 p-2"></th>
                <th className="h-8 animate-pulse rounded-md bg-gray-700 p-2"></th>
                <th className="h-8 animate-pulse rounded-md bg-gray-700 p-2"></th>
              </tr>
            </thead>
            <tbody>
              {skeletonRows.map((row) => (
                <tr key={row} className="border-t border-gray-800">
                  <td className="p-2">
                    <div className="h-6 w-36 animate-pulse rounded-md bg-gray-700"></div>
                  </td>
                  <td className="p-2">
                    <div className="h-6 w-64 animate-pulse rounded-md bg-gray-700"></div>
                  </td>
                  <td className="p-2">
                    <div className="h-6 w-16 animate-pulse rounded-md bg-gray-700"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
