import { useState, useMemo, useEffect, useRef } from "react";
import { useMessages } from "../context/MessagesContext";
import { Card, CardContent, CardHeader } from "../../shared/components/ui/Card";
import { Input } from "../../shared/components/ui/Input";
import { Button } from "../../shared/components/ui/Button";
import { Skeleton } from "../../shared/components/ui/Skeleton";
import { Search, Filter, MessageSquare, Mail, Clock, Eye, EyeOff, Trash2, ChevronDown, ChevronUp, User, Calendar } from "lucide-react";

export default function Messages() {
  const { messages, loading, markAsRead, markAsUnread, deleteMessage } = useMessages();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredMessages = useMemo(() => {
    return messages.filter(msg => {
      const matchSearch = (msg.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (msg.subject || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (msg.email || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'all' || 
        (statusFilter === 'unread' && !msg.read) ||
        (statusFilter === 'read' && msg.read);
      return matchSearch && matchStatus;
    });
  }, [messages, searchTerm, statusFilter]);

  const handleExpand = async (msg) => {
    if (expandedId === msg.firestoreId) {
      setExpandedId(null);
    } else {
      setExpandedId(msg.firestoreId);
      if (!msg.read) {
        await markAsRead(msg.firestoreId);
      }
    }
  };

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-brand-primary rounded-xl text-white shadow-lg shadow-brand-primary/10">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-950 dark:text-zinc-100 tracking-tightest leading-tight">Messages</h1>
            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              {messages.length} Total · <span className="text-brand-primary">{unreadCount} Unread</span>
            </p>
          </div>
        </div>
      </div>

      <Card className="border border-zinc-100 dark:border-zinc-900 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-zinc-100 dark:border-zinc-900 flex flex-col sm:flex-row gap-4 justify-between pb-4 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
            <Input placeholder="Filter communications..." className="pl-10 h-10 w-full rounded-xl border-zinc-200 dark:border-zinc-800" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-shrink-0" ref={filterRef}>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center justify-center gap-3 bg-white dark:bg-zinc-950 px-4 h-10 rounded-xl border border-zinc-200 dark:border-zinc-800 w-44 text-[11px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-500 hover:border-brand-primary transition-all duration-300 shadow-sm"
              >
                <Filter className="h-3.5 w-3.5 text-brand-primary flex-shrink-0 opacity-70" />
                <span className="flex-1 text-left">
                  {statusFilter === 'all' ? 'All Inquiries' : statusFilter === 'unread' ? 'Unread' : 'Read'}
                </span>
                <ChevronDown className={`h-3 w-3 text-zinc-400 transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>

              {isFilterOpen && (
                <div className="absolute top-full mt-2 right-0 w-44 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in duration-200">
                  {[
                    { value: 'all', label: 'All Inquiries' },
                    { value: 'unread', label: 'Unread' },
                    { value: 'read', label: 'Read' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => { setStatusFilter(opt.value); setIsFilterOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-[11px] font-bold uppercase tracking-widest transition-all duration-200 text-left
                        ${statusFilter === opt.value
                          ? 'bg-brand-primary/10 text-brand-primary'
                          : 'text-zinc-500 dark:text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                        }`}
                    >
                      {statusFilter === opt.value && (
                        <span className="h-1.5 w-1.5 rounded-full bg-brand-primary flex-shrink-0" />
                      )}
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center px-4">
              <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl mb-4 border border-zinc-100 dark:border-zinc-800 shadow-sm">
                <MessageSquare className="h-10 w-10 text-zinc-200 dark:text-zinc-700" />
              </div>
              <p className="text-zinc-500 dark:text-zinc-500 font-semibold uppercase tracking-widest text-xs">No interactions found</p>
              <p className="text-zinc-400 dark:text-zinc-600 text-xs mt-1">Direct inquiries will be recorded here.</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-50 dark:divide-zinc-900/50">
              {filteredMessages.map((msg) => (
                <div
                  key={msg.firestoreId}
                  className={`transition-all duration-200 ${!msg.read ? 'bg-brand-primary/[0.03] dark:bg-brand-primary/[0.03] border-l-4 border-l-brand-primary' : 'hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50'}`}
                >
                  <div
                    className="px-6 py-4 cursor-pointer flex items-start gap-4"
                    onClick={() => handleExpand(msg)}
                  >
                    {/* Avatar */}
                    <div className={`p-2.5 rounded-xl flex-shrink-0 ${!msg.read ? 'bg-brand-primary/10' : 'bg-zinc-100 dark:bg-zinc-900'}`}>
                      <User className={`h-4 w-4 ${!msg.read ? 'text-brand-primary' : 'text-zinc-400'}`} />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-sm font-semibold tracking-tight ${!msg.read ? 'text-zinc-950 dark:text-zinc-100' : 'text-zinc-500 dark:text-zinc-500'}`}>{msg.name || "Anonymous"}</span>
                        {!msg.read && (
                          <span className="bg-brand-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">new</span>
                        )}
                      </div>
                      <p className={`text-sm ${!msg.read ? 'font-semibold text-zinc-800 dark:text-zinc-200' : 'font-normal text-zinc-500 dark:text-zinc-400'} truncate mt-1 tracking-tight`}>{msg.subject || "No Subject"}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[11px] font-medium text-zinc-400 flex items-center gap-1"><Mail className="h-3.5 w-3.5 opacity-70" /> {msg.email}</span>
                        <span className="text-[11px] font-medium text-zinc-400 flex items-center gap-1 uppercase tracking-wider">
                          <Calendar className="h-3.5 w-3.5 opacity-70" />
                          {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleDateString() : new Date(msg.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {expandedId === msg.firestoreId ? <ChevronUp className="h-4 w-4 text-zinc-400" /> : <ChevronDown className="h-4 w-4 text-zinc-400" />}
                    </div>
                  </div>

                  {/* Expanded Message */}
                  {expandedId === msg.firestoreId && (
                    <div className="px-6 pb-5 pt-0 ml-14 animate-in">
                      <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-xl p-5 shadow-sm">
                        <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap font-normal">{msg.message}</p>
                        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-zinc-50 dark:border-zinc-900">
                          <a href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'Your Inquiry')}`} onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-brand-primary hover:bg-brand-primary/10 rounded-lg text-xs"
                            >
                              <Mail className="h-3.5 w-3.5 mr-1.5" /> Direct Reply
                            </Button>
                          </a>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); msg.read ? markAsUnread(msg.firestoreId) : markAsRead(msg.firestoreId); }}
                            className="text-zinc-500 hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg text-xs"
                          >
                            {msg.read ? <><EyeOff className="h-3.5 w-3.5 mr-1.5" /> Keep As Unread</> : <><Eye className="h-3.5 w-3.5 mr-1.5" /> Mark As Read</>}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); deleteMessage(msg.firestoreId); setExpandedId(null); }}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg text-xs"
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
