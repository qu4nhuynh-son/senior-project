import React, { useState } from 'react'

const AddEventModal = ({ onClose, onSave }) => {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [color, setColor] = useState('bg-green-100')

  const handleSave = () => {
    if (!title || !date) return
    onSave({ title, date, color })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-md w-80 space-y-4">
        <h3 className="text-lg font-semibold">Add Event</h3>
        <input type="text" placeholder="Title" className="w-full p-2 rounded border" value={title} onChange={e => setTitle(e.target.value)} />
        <input type="date" className="w-full p-2 rounded border" value={date} onChange={e => setDate(e.target.value)} />
        <select className="w-full p-2 rounded border" value={color} onChange={e => setColor(e.target.value)}>
          <option value="bg-green-100">Green</option>
          <option value="bg-yellow-100">Yellow</option>
          <option value="bg-purple-100">Purple</option>
          <option value="bg-blue-100">Blue</option>
        </select>
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-3 py-1 bg-gray-200 rounded">Cancel</button>
          <button onClick={handleSave} className="px-3 py-1 bg-black text-white rounded">Save</button>
        </div>
      </div>
    </div>
  )
}

export default AddEventModal
