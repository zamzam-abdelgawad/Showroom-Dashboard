import { useState, useMemo } from "react";
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
          <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white shadow-lg shadow-indigo-200">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Messages</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {messages.length} total · <span className="text-indigo-600 dark:text-indigo-400 font-medium">{unreadCount} unread</span>
            </p>
          </div>
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="border-b border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between pb-4 bg-gray-50/50 dark:bg-slate-900/50">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input placeholder="Search messages..." className="pl-10 h-10 w-full rounded-xl border-gray-200 dark:border-slate-700" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select className="h-10 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-gray-100" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Messages</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center px-4">
              <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-2xl mb-4">
                <MessageSquare className="h-10 w-10 text-gray-300 dark:text-slate-600" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">No messages found</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Messages from users will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50 dark:divide-slate-800/50">
              {filteredMessages.map((msg) => (
                <div
                  key={msg.firestoreId}
                  className={`transition-all duration-200 ${!msg.read ? 'bg-indigo-50/30 dark:bg-indigo-900/20 border-l-3 border-l-indigo-500' : 'hover:bg-gray-50/50 dark:hover:bg-slate-800/50'}`}
                >
                  <div
                    className="px-6 py-4 cursor-pointer flex items-start gap-4"
                    onClick={() => handleExpand(msg)}
                  >
                    {/* Avatar */}
                    <div className={`p-2.5 rounded-xl flex-shrink-0 ${!msg.read ? 'bg-indigo-100 dark:bg-indigo-900/40' : 'bg-gray-100 dark:bg-slate-800'}`}>
                      <User className={`h-4 w-4 ${!msg.read ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`} />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-sm font-bold ${!msg.read ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-400'}`}>{msg.name || "Anonymous"}</span>
                        {!msg.read && (
                          <span className="bg-indigo-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase">new</span>
                        )}
                      </div>
                      <p className={`text-sm ${!msg.read ? 'font-semibold text-gray-800 dark:text-gray-200' : 'font-medium text-gray-600 dark:text-gray-500'} truncate`}>{msg.subject || "No Subject"}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[11px] text-gray-400 flex items-center gap-1"><Mail className="h-3 w-3" /> {msg.email}</span>
                        <span className="text-[11px] text-gray-400 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleDateString() : new Date(msg.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {expandedId === msg.firestoreId ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                    </div>
                  </div>

                  {/* Expanded Message */}
                  {expandedId === msg.firestoreId && (
                    <div className="px-6 pb-5 pt-0 ml-14 animate-in">
                      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl p-5 shadow-sm">
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-slate-800">
                          <a href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'Your Inquiry')}`} onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg text-xs"
                            >
                              <Mail className="h-3.5 w-3.5 mr-1.5" /> Reply
                            </Button>
                          </a>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); msg.read ? markAsUnread(msg.firestoreId) : markAsRead(msg.firestoreId); }}
                            className="text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg text-xs"
                          >
                            {msg.read ? <><EyeOff className="h-3.5 w-3.5 mr-1.5" /> Mark Unread</> : <><Eye className="h-3.5 w-3.5 mr-1.5" /> Mark Read</>}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); deleteMessage(msg.firestoreId); setExpandedId(null); }}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg text-xs"
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
