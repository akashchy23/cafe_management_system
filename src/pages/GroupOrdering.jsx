import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { io } from 'socket.io-client'
import {
  FaUsers,
  FaQrcode,
  FaPlus,
  FaTrash,
  FaCreditCard,
  FaCheckCircle,
  FaClock,
  FaShareAlt,
  FaCopy,
  FaUtensils,
  FaMinus,
  FaShieldAlt,
  FaExclamationCircle,
} from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import Swal from 'sweetalert2'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function GroupOrdering() {
  const { sessionId: paramSessionId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(false)
  const [socketConnected, setSocketConnected] = useState(false)

  // Creation & Join modal states
  const [createName, setCreateName] = useState('')
  const [joinCodeInput, setJoinCodeInput] = useState('')
  const [creating, setCreating] = useState(false)
  const [joining, setJoining] = useState(false)
  const [qrModalOpen, setQrModalOpen] = useState(false)
  const [addFoodModalOpen, setAddFoodModalOpen] = useState(false)
  const [availableFoods, setAvailableFoods] = useState([])
  const [payingShare, setPayingShare] = useState(false)

  const socketRef = useRef(null)

  // Initialize Socket.IO connection
  useEffect(() => {
    socketRef.current = io(API_URL, {
      transports: ['websocket', 'polling'],
    })

    socketRef.current.on('connect', () => {
      setSocketConnected(true)
    })

    socketRef.current.on('disconnect', () => {
      setSocketConnected(false)
    })

    socketRef.current.on('session-updated', (updatedSession) => {
      setSession(updatedSession)
    })

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [])

  // Join room when session ID changes
  useEffect(() => {
    if (session?.sessionId && socketRef.current) {
      socketRef.current.emit('join-group-session', session.sessionId)
    }
    return () => {
      if (session?.sessionId && socketRef.current) {
        socketRef.current.emit('leave-group-session', session.sessionId)
      }
    }
  }, [session?.sessionId])

  // Fetch session if paramSessionId is in URL
  useEffect(() => {
    if (paramSessionId && user) {
      loadSession(paramSessionId)
    }
  }, [paramSessionId, user])

  const loadSession = async (id) => {
    try {
      setLoading(true)
      const res = await api.get(`/api/group-orders/${id}`)
      setSession(res.data)

      // Also ensure member is in the session members list
      if (user) {
        const isMember = res.data.members?.some((m) => m.uid === user.uid)
        if (!isMember) {
          await api.post(`/api/group-orders/${id}/join`, { joinCode: res.data.joinCode })
          const refreshed = await api.get(`/api/group-orders/${id}`)
          setSession(refreshed.data)
        }
      }
    } catch (err) {
      console.error('Failed to load group session:', err)
      Swal.fire({
        icon: 'error',
        title: 'Session Not Found',
        text: 'The group session code is invalid or has expired.',
      })
    } finally {
      setLoading(false)
    }
  }

  // Load available foods for modal
  const loadFoods = async () => {
    try {
      const res = await api.get('/api/foods')
      setAvailableFoods(res.data)
    } catch (err) {
      console.error('Failed to load foods:', err)
    }
  }

  useEffect(() => {
    loadFoods()
  }, [])

  // Create new session
  const handleCreateSession = async (e) => {
    e.preventDefault()
    if (!user) {
      navigate('/login')
      return
    }
    try {
      setCreating(true)
      const res = await api.post('/api/group-orders/create', { sessionName: createName })
      setSession(res.data.session)
      navigate(`/group-order/${res.data.session.sessionId}`)
      Swal.fire({
        icon: 'success',
        title: 'Group Session Created!',
        text: `Share Join Code: ${res.data.session.joinCode} with your table friends.`,
        confirmButtonColor: '#6F4E37',
      })
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to create group session' })
    } finally {
      setCreating(false)
    }
  }

  // Join existing session by code
  const handleJoinSession = async (e) => {
    e.preventDefault()
    if (!user) {
      navigate('/login')
      return
    }
    if (!joinCodeInput.trim()) return

    try {
      setJoining(true)
      const res = await api.post(`/api/group-orders/${joinCodeInput.trim().toUpperCase()}/join`, {
        joinCode: joinCodeInput.trim(),
      })
      setSession(res.data.session)
      navigate(`/group-order/${res.data.session.sessionId}`)
      Swal.fire({
        icon: 'success',
        title: 'Joined Group Session!',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
      })
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Join Failed',
        text: err.response?.data?.error || 'Could not join session.',
      })
    } finally {
      setJoining(false)
    }
  }

  // Add food to group cart
  const handleAddFoodToCart = async (food) => {
    if (!session) return
    try {
      await api.post(`/api/group-orders/${session.sessionId}/items`, {
        foodId: food._id,
        quantity: 1,
      })
      setAddFoodModalOpen(false)
      Swal.fire({
        icon: 'success',
        title: 'Added to Shared Cart',
        text: `${food.name} added to group order.`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
      })
    } catch (err) {
      console.error('Failed to add food to group session:', err)
    }
  }

  // Adjust food quantity
  const handleUpdateItemQty = async (item, delta) => {
    if (!session) return
    const newQty = item.quantity + delta
    try {
      await api.patch(`/api/group-orders/${session.sessionId}/items/${item.foodId}`, {
        quantity: newQty,
      })
    } catch (err) {
      console.error('Failed to update group item quantity:', err)
    }
  }

  // Pay individual member share
  const handlePayShare = async () => {
    if (!session || !user) return
    const myShare = session.memberBreakdown?.find((m) => m.uid === user.uid)
    if (!myShare || myShare.subtotal <= 0) {
      Swal.fire({ icon: 'info', title: 'Nothing to Pay', text: 'You have no items in this group cart.' })
      return
    }

    const confirm = await Swal.fire({
      title: 'Pay Your Share',
      html: `
        <div class="text-left text-sm space-y-2">
          <p><strong>Your Order Share:</strong> $${myShare.subtotal.toFixed(2)}</p>
          <p class="text-gray-500 text-xs">Simulated secure payment gateway (Stripe / SSLCommerz architecture).</p>
        </div>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: `Pay $${myShare.subtotal.toFixed(2)} Now`,
      confirmButtonColor: '#10B981',
    })

    if (confirm.isConfirmed) {
      try {
        setPayingShare(true)
        const res = await api.post(`/api/group-orders/${session.sessionId}/pay-share`, {
          paymentMethod: 'Online Payment (Stripe / SSLCommerz)',
        })
        setSession(res.data.session)
        Swal.fire({
          icon: 'success',
          title: 'Payment Successful!',
          text: res.data.message,
          confirmButtonColor: '#6F4E37',
        })
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Payment Failed', text: 'Could not complete share payment.' })
      } finally {
        setPayingShare(false)
      }
    }
  }

  const copyJoinLink = () => {
    const joinUrl = `${window.location.origin}/group-order/${session?.sessionId}`
    navigator.clipboard.writeText(joinUrl)
    Swal.fire({
      icon: 'success',
      title: 'Link Copied!',
      text: 'Share this link with your friends to join the live session.',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
    })
  }

  const joinUrl = session ? `${window.location.origin}/group-order/${session.sessionId}` : ''
  const myShare = session?.memberBreakdown?.find((m) => m.uid === user?.uid)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Real-time Status Banner */}
      <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-2xl border border-[#EBE2D7] text-xs">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${socketConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className="font-bold text-[#3B2314]">
            {socketConnected ? 'Live Socket.IO Synchronized' : 'Connecting to Realtime Channel...'}
          </span>
        </div>
        <span className="text-[#8C7A6E]">Instant Live Cart & Bill Splitting</span>
      </div>

      {!session ? (
        /* Create or Join Hero */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Create Group Session */}
          <div className="bg-white rounded-3xl border border-[#EBE2D7] p-8 sm:p-10 shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center text-xl font-bold">
                <FaUsers />
              </div>
              <h2 className="text-2xl font-black text-[#3B2314]">Start a Group Order</h2>
              <p className="text-xs text-[#7A695E]">
                Create a live collaborative cart session for your table or office colleagues. Everyone can add items and pay their own share.
              </p>
            </div>

            <form onSubmit={handleCreateSession} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#54433A] mb-1">
                  Session Name / Table # (Optional)
                </label>
                <input
                  type="text"
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  placeholder="e.g. Table 4 Coffee Break"
                  className="w-full px-4 py-3 rounded-xl border border-[#DED4C7] text-sm text-[#3B2314] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full py-3.5 rounded-xl bg-[#6F4E37] hover:bg-[#543825] text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
              >
                <FaPlus />
                <span>{creating ? 'Creating Session...' : 'Create Group Session'}</span>
              </button>
            </form>
          </div>

          {/* Join Group Session */}
          <div className="bg-white rounded-3xl border border-[#EBE2D7] p-8 sm:p-10 shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center text-xl font-bold">
                <FaQrcode />
              </div>
              <h2 className="text-2xl font-black text-[#3B2314]">Join with Code or QR</h2>
              <p className="text-xs text-[#7A695E]">
                Have a 6-digit join code or session ID from your friend? Enter it below to immediately jump into their shared cart.
              </p>
            </div>

            <form onSubmit={handleJoinSession} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#54433A] mb-1">
                  Session Code or ID *
                </label>
                <input
                  type="text"
                  required
                  value={joinCodeInput}
                  onChange={(e) => setJoinCodeInput(e.target.value)}
                  placeholder="e.g. 123456 or GRP-ABC123"
                  className="w-full px-4 py-3 rounded-xl border border-[#DED4C7] text-sm font-mono uppercase text-[#3B2314] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={joining}
                className="w-full py-3.5 rounded-xl bg-[#3B2314] hover:bg-[#2C1810] text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
              >
                <FaUsers />
                <span>{joining ? 'Connecting...' : 'Join Shared Cart'}</span>
              </button>
            </form>
          </div>

        </div>
      ) : (
        /* Active Group Session Workspace */
        <div className="space-y-8">
          
          {/* Header Card */}
          <div className="bg-gradient-to-r from-[#3B2314] via-[#543825] to-[#3B2314] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs uppercase border border-emerald-400/30">
                  ● {session.status} Session
                </span>
                <span className="text-xs text-amber-200">
                  Host: <strong>{session.creatorName}</strong>
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{session.sessionName}</h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#D4C3B3]">
                <span>Session ID: <strong className="font-mono text-white">{session.sessionId}</strong></span>
                <span>•</span>
                <span>Join Code: <strong className="font-mono text-amber-300 text-sm">{session.joinCode}</strong></span>
                <span>•</span>
                <span>{session.members?.length || 0} Member(s) Connected</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setQrModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 border border-white/20 transition-all"
              >
                <FaQrcode className="w-3.5 h-3.5" />
                <span>Show QR Code</span>
              </button>
              <button
                onClick={copyJoinLink}
                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
              >
                <FaCopy className="w-3.5 h-3.5" />
                <span>Copy Link</span>
              </button>
            </div>
          </div>

          {/* Main Grid: Shared Cart & Split-Bill Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2 Cols: Shared Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              
              <div className="bg-white rounded-3xl border border-[#EBE2D7] p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <h2 className="text-lg font-extrabold text-[#3B2314]">Shared Live Cart</h2>
                    <p className="text-xs text-[#8C7A6E]">Updates instantly when anyone at your table adds food</p>
                  </div>
                  {session.status === 'active' && (
                    <button
                      onClick={() => setAddFoodModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-[#6F4E37] text-white font-bold text-xs hover:bg-[#543825] flex items-center gap-1.5 shadow-2xs"
                    >
                      <FaPlus className="w-3 h-3" />
                      <span>Add Menu Item</span>
                    </button>
                  )}
                </div>

                {(!session.items || session.items.length === 0) ? (
                  <div className="py-12 text-center space-y-3">
                    <FaUtensils className="w-10 h-10 text-gray-300 mx-auto" />
                    <p className="text-xs font-bold text-[#3B2314]">Your group cart is currently empty.</p>
                    <button
                      onClick={() => setAddFoodModalOpen(true)}
                      className="px-4 py-2 bg-amber-100 text-amber-900 font-bold text-xs rounded-xl hover:bg-amber-200"
                    >
                      Browse Cafe Menu to Add Items
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {session.items.map((item, idx) => (
                      <div key={`${item.foodId}-${idx}`} className="py-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image || 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=200'}
                            alt={item.foodName}
                            className="w-14 h-14 rounded-2xl object-cover border border-[#EBE2D7]"
                          />
                          <div>
                            <h3 className="font-extrabold text-sm text-[#3B2314]">{item.foodName}</h3>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs font-bold text-[#6F4E37]">
                                ${item.price?.toFixed(2)} each
                              </span>
                              <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md font-semibold">
                                Added by: <strong>{item.addedByName}</strong>
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Only adder can modify their own item */}
                          {item.addedByUserId === user?.uid && session.status === 'active' ? (
                            <div className="flex items-center gap-1.5 bg-[#FAF6F0] p-1 rounded-xl border border-[#E8DFD3]">
                              <button
                                onClick={() => handleUpdateItemQty(item, -1)}
                                className="w-6 h-6 rounded-lg bg-white text-gray-700 font-black text-xs hover:bg-gray-100 flex items-center justify-center shadow-xs"
                              >
                                -
                              </button>
                              <span className="w-6 text-center text-xs font-black">{item.quantity}</span>
                              <button
                                onClick={() => handleUpdateItemQty(item, 1)}
                                className="w-6 h-6 rounded-lg bg-white text-gray-700 font-black text-xs hover:bg-gray-100 flex items-center justify-center shadow-xs"
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs font-bold text-gray-500">Qty: {item.quantity}</span>
                          )}

                          <span className="font-black text-sm text-[#3B2314] min-w-[60px] text-right">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Right Col: Split the Bill & Individual Payment */}
            <div className="space-y-6">
              
              <div className="bg-white rounded-3xl border border-[#EBE2D7] p-6 shadow-sm space-y-5">
                <div className="border-b border-gray-100 pb-3">
                  <h2 className="text-lg font-extrabold text-[#3B2314]">Split the Bill Breakdown</h2>
                  <p className="text-xs text-[#8C7A6E]">Automatic backend share calculation</p>
                </div>

                {/* Member Shares List */}
                <div className="space-y-3">
                  {session.memberBreakdown?.map((member) => (
                    <div
                      key={member.uid}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        member.uid === user?.uid
                          ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-400/30'
                          : 'bg-[#FAF6F0] border-[#E8DFD3]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#6F4E37] text-white flex items-center justify-center font-bold text-xs uppercase">
                            {member.name[0]}
                          </div>
                          <div>
                            <span className="font-bold text-xs text-[#3B2314] block">
                              {member.name} {member.uid === user?.uid && '(You)'}
                            </span>
                            <span className="text-[10px] text-[#8C7A6E]">
                              {member.items?.length || 0} item(s) selected
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-black text-sm text-[#3B2314]">
                            ${member.subtotal?.toFixed(2)}
                          </div>
                          {member.paymentStatus === 'Paid' ? (
                            <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                              <FaCheckCircle className="w-2.5 h-2.5" />
                              <span>Paid</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                              <FaClock className="w-2.5 h-2.5" />
                              <span>Pending</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Group Total Banner */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-sm font-extrabold text-[#3B2314]">
                  <span>Group Total:</span>
                  <span className="text-xl font-black text-[#6F4E37]">
                    ${session.groupSubtotal?.toFixed(2)}
                  </span>
                </div>

                {/* My Share Payment CTA */}
                {myShare && myShare.subtotal > 0 && myShare.paymentStatus !== 'Paid' && (
                  <button
                    onClick={handlePayShare}
                    disabled={payingShare}
                    className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
                  >
                    <FaCreditCard />
                    <span>
                      {payingShare ? 'Processing...' : `Pay My Share ($${myShare.subtotal.toFixed(2)})`}
                    </span>
                  </button>
                )}

                {myShare?.paymentStatus === 'Paid' && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                    <p className="text-xs font-black text-emerald-800 flex items-center justify-center gap-1.5">
                      <FaCheckCircle className="w-3.5 h-3.5" />
                      <span>You have paid your share!</span>
                    </p>
                    <p className="text-[10px] text-emerald-700">
                      {session.allPaid ? 'All group members have paid. Order is submitted to the kitchen!' : 'Waiting for other members to finish their share.'}
                    </p>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {qrModalOpen && session && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-extrabold text-base text-[#3B2314]">Group QR Code</h3>
              <button onClick={() => setQrModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold">
                ✕
              </button>
            </div>

            <div className="bg-[#FDFBF7] p-6 rounded-2xl border border-[#EBE2D7] inline-block mx-auto">
              <QRCodeSVG value={joinUrl} size={200} level="M" />
            </div>

            <div>
              <p className="text-xs font-bold text-[#3B2314]">{session.sessionName}</p>
              <p className="text-[11px] text-[#8C7A6E]">
                Friends can point their camera here or enter code <strong className="text-amber-800 font-mono text-sm">{session.joinCode}</strong>.
              </p>
            </div>

            <button
              onClick={() => setQrModalOpen(false)}
              className="w-full py-2.5 bg-[#6F4E37] text-white font-bold text-xs rounded-xl"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Add Food Modal */}
      {addFoodModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] p-6 flex flex-col shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-[#3B2314]">Add Food to Group Cart</h3>
                <p className="text-[11px] text-[#8C7A6E]">Select any menu item to add under your name</p>
              </div>
              <button onClick={() => setAddFoodModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold">
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3 divide-y divide-gray-100">
              {availableFoods.map((food) => (
                <div key={food._id} className="pt-3 first:pt-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={food.image} alt={food.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-extrabold text-xs text-[#3B2314]">{food.name}</h4>
                      <p className="text-[10px] text-[#8C7A6E]">{food.category}</p>
                      <span className="font-black text-xs text-[#6F4E37]">${food.price?.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddFoodToCart(food)}
                    className="px-4 py-2 rounded-xl bg-[#6F4E37] hover:bg-[#543825] text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs"
                  >
                    <FaPlus className="w-2.5 h-2.5" />
                    <span>Add</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
