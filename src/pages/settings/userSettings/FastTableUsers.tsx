import defaultUserImage from '@/assets/placeholder-image/default-user.png'
import { formatDateToDDMMYYYY } from '@renderer/utils'
import { Trash2Icon } from 'lucide-react'

import { formatIndex, getImageUrl } from '@renderer/utils'
import { PencilIcon } from 'lucide-react'

type FastTableUsersProps = {
  users: UserData[]
  openDialog: (user: UserData, type: 'update' | 'delete') => void
}

export default function FastTableUsers({ users, openDialog }: FastTableUsersProps) {
  return (
    <div className="overflow-auto rounded-xl border border-background">
      <table className="w-full text-left text-base border-collapse">
        <caption className="sr-only">A list of your users</caption>
        <thead className="bg-tableHead text-background font-medium">
          <tr>
            <th className="px-4 py-2">No</th>
            <th className="px-4 py-2">User Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Created Date</th>
            <th className="px-4 py-2">Role</th>
            <th className="px-4 py-2">Phone</th>
            <th className="px-4 py-2">Address</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id} className="border-t">
              <td className="px-4 py-2">{formatIndex(index)}</td>
              <td className="px-4 py-2">
                <div className="flex items-center gap-2">
                  <img
                    src={getImageUrl(user.imageUrl)}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget
                      target.src = defaultUserImage
                    }}
                  />
                  <span>{user.name}</span>
                </div>
              </td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">{formatDateToDDMMYYYY(user.createdAt)}</td>
              <td className="px-4 py-2">{user.role}</td>
              <td className="px-4 py-2">{user.phone}</td>
              <td className="px-4 py-2">{user.address}</td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => openDialog(user, 'update')}
                    className="border border-destructive text-destructive p-2 rounded hover:bg-destructive/10"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openDialog(user, 'delete')}
                    className="border border-secondary text-secondary p-2 rounded hover:bg-secondary/10"
                  >
                    <Trash2Icon className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
