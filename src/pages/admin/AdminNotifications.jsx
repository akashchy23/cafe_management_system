import { useState } from 'react'
import {
  FaPaperPlane,
  FaBell,
  FaUsers,
  FaTag,
  FaReceipt,
  FaInfoCircle,
} from 'react-icons/fa'
import api from '../../api/axios'
import Swal from 'sweetalert2'

export default function AdminNotifications() {
  const [recipient, setRecipient] = useState('all')
  const [customUid, setCustomUid] = useState('')
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [type, setType] = useState('promo')
  const [sending, setSending] = useState(false)

  const handleSendNotification = async (e) => {
    e.preventDefault()
    if (!title.trim() || !message.trim()) return

    const target = recipient === 'specific' ? customUid.trim() : 'all'

    try {
      setSending(true)
      await api.post('/api/admin/notifications', {
        recipientUserId: target,
        title,
        message,
        type,
      })
      Swal.fire({
        icon: 'success',
        title: 'Notification Dispatched!',
        text: `Alert sent to ${recipient === 'specific' ? `Customer (${target})` : 'all active cafe customers'}.`,
        confirmButtonColor: '#6F4E37',
      })
      setTitle('')
      setMessage('')
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to send notification.',
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#3B2314] tracking-tight">
          Broadcast & Send Notifications
        </h1>
        <p className="text-xs text-[#7A695E] mt-1">
          Dispatch promotional alerts, kitchen order announcements, or custom direct messages to customers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Form */}
        <div className="md:col-span-2 bg-white rounded-3xl border border-[#EBE2D7] p-6 sm:p-8 shadow-sm space-y-6">
          <form onSubmit={handleSendNotification} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#54433A] mb-1">
                Target Audience *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRecipient('all')}
                  className={`py-3 px-4 rounded-xl border text-xs font-bold text-left transition-all ${
                    recipient === 'all'
                      ? 'bg-[#3B2314] text-white border-[#3B2314] shadow-sm'
                      : 'bg-white text-gray-700 border-[#DED4C7] hover:bg-gray-50'
                  }`}
                >
                  <FaUsers className="w-4 h-4 mb-1" />
                  <span>All Cafe Customers</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRecipient('specific')}
                  className={`py-3 px-4 rounded-xl border text-xs font-bold text-left transition-all ${
                    recipient === 'specific'
                      ? 'bg-[#3B2314] text-white border-[#3B2314] shadow-sm'
                      : 'bg-white text-gray-700 border-[#DED4C7] hover:bg-gray-50'
                  }`}
                >
                  <FaBell className="w-4 h-4 mb-1" />
                  <span>Specific Customer UID</span>
                </button>
              </div>
            </div>

            {recipient === 'specific' && (
              <div>
                <label className="block text-xs font-bold uppercase text-[#54433A] mb-1">
                  Customer Firebase UID *
                </label>
                <input
                  type="text"
                  required
                  value={customUid}
                  onChange={(e) => setCustomUid(e.target.value)}
                  placeholder="e.g. Firebase UID or User ID"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DED4C7] text-xs font-mono text-[#3B2314] focus:outline-none"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#54433A] mb-1">
                  Notification Category
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DED4C7] text-xs font-bold text-[#3B2314] focus:outline-none"
                >
                  <option value="promo">Special Offer / Promotion</option>
                  <option value="order">Order Status Update</option>
                  <option value="system">System / Booking Update</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#54433A] mb-1">
                  Notification Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 20% Off Weekend Artisanal Coffee"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DED4C7] text-xs text-[#3B2314] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#54433A] mb-1">
                Message Content *
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write the notification message that will appear in the customer's notification inbox..."
                className="w-full p-4 rounded-xl border border-[#DED4C7] text-xs text-[#3B2314] focus:outline-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={sending}
              className="px-6 py-3 rounded-xl bg-[#6F4E37] hover:bg-[#543825] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
            >
              <FaPaperPlane />
              <span>{sending ? 'Sending Alert...' : 'Dispatch Notification'}</span>
            </button>
          </form>
        </div>

        {/* Live Preview Card */}
        <div className="bg-[#FAF6F0] rounded-3xl border border-[#EBE2D7] p-6 space-y-4">
          <h2 className="font-extrabold text-sm text-[#3B2314] border-b border-[#E0D3C5] pb-2">
            Customer Inbox Preview
          </h2>

          <div className="bg-white rounded-2xl border border-[#EBE2D7] p-4 shadow-sm space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center text-xs">
                {type === 'promo' ? <FaTag /> : type === 'order' ? <FaReceipt /> : <FaInfoCircle />}
              </div>
              <h3 className="font-extrabold text-xs text-[#3B2314]">
                {title || 'Headline will appear here'}
              </h3>
            </div>
            <p className="text-[11px] text-[#54433A] leading-relaxed">
              {message || 'The notification body text will render here for the customer.'}
            </p>
            <span className="text-[9px] text-[#8C7A6E] block pt-1">Just now</span>
          </div>

          <div className="text-[11px] text-[#8C7A6E] space-y-1">
            <p>• Customers will see an unread badge counter in their top navbar.</p>
            <p>• Notifications are securely filtered based on Firebase UID.</p>
          </div>
        </div>

      </div>

    </div>
  )
}
