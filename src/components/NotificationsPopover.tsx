import * as React from "react"
import { Bell, Check, X, AlertCircle, Upload, User, Brain, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

type NotificationType = 'user' | 'sync' | 'upload' | 'agent' | 'error'

interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: Date
  read: boolean
  action?: {
    label: string
    href: string
  }
  store?: string
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'agent',
    title: 'Invoice Agent: New Contact Added',
    message: 'AI Agent has identified and added a new supplier "Tech Supplies Inc" from recent invoice data',
    timestamp: new Date(),
    read: false,
    action: {
      label: 'Review Contact',
      href: '/accounting/Contacts'
    }
  },
  {
    id: '2',
    type: 'agent',
    title: 'Invoice Agent: Default Account Mapping',
    message: 'AI Agent has suggested default account code mappings for "Office Supplies" category',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
    action: {
      label: 'Review Mappings',
      href: '/settings/AccountCodeMappings'
    }
  },
  {
    id: '3',
    type: 'agent',
    title: 'Invoice Agent: Needs Review',
    message: 'Unable to determine store assignment for invoice #INV-2024-001 from "Global Electronics"',
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    read: false,
    action: {
      label: 'Review Invoice',
      href: '/accounting/Purchases'
    }
  },
  {
    id: '4',
    type: 'sync',
    title: 'Store MX Sync Complete',
    message: 'Successfully synchronized inventory data from Store MX for all locations',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    read: false,
    action: {
      label: 'View Changes',
      href: '/accounting/StockControl'
    }
  },
  {
    id: '5',
    type: 'sync',
    title: 'Chart of Accounts Sync',
    message: 'Updated chart of accounts with latest changes from accounting system',
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    read: false,
    action: {
      label: 'Review Changes',
      href: '/settings/COASync'
    }
  },
  {
    id: '6',
    type: 'agent',
    title: 'Invoice Agent: Analysis Complete',
    message: 'AI Agent has completed analysis of Q4 financial data and identified potential cost savings',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: true,
    action: {
      label: 'View Report',
      href: '/insights/FinancialReports'
    }
  }
]

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'agent':
      return <Brain className="h-4 w-4" />
    case 'sync':
      return <Database className="h-4 w-4" />
    case 'upload':
      return <Upload className="h-4 w-4" />
    case 'user':
      return <User className="h-4 w-4" />
    case 'error':
      return <AlertCircle className="h-4 w-4" />
    default:
      return <Bell className="h-4 w-4" />
  }
}

const getNotificationColor = (type: NotificationType) => {
  switch (type) {
    case 'agent':
      return 'bg-purple-100 text-purple-800'
    case 'sync':
      return 'bg-blue-100 text-blue-800'
    case 'upload':
      return 'bg-green-100 text-green-800'
    case 'user':
      return 'bg-yellow-100 text-yellow-800'
    case 'error':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function NotificationsPopover() {
  const [notifications, setNotifications] = React.useState<Notification[]>(mockNotifications)
  const [selectedType, setSelectedType] = React.useState<NotificationType | 'all'>('all')

  const unreadCount = notifications.filter(n => !n.read).length

  const filteredNotifications = notifications.filter(notification => {
    return selectedType === 'all' || notification.type === selectedType
  })

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const clearNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative bg-transparent text-white hover:bg-white/20">
          <Bell className="h-5 w-5 text-white" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-semibold">Notifications</h4>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>

        <div className="p-2 border-b">
          <div className="flex gap-2">
            <Button
              variant={selectedType === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('all')}
            >
              All
            </Button>
            <Button
              variant={selectedType === 'agent' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('agent')}
            >
              Agent
            </Button>
            <Button
              variant={selectedType === 'sync' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('sync')}
            >
              Sync
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[400px]">
          {filteredNotifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No notifications found
            </div>
          ) : (
            <div className="p-2">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-3 rounded-lg mb-2 relative",
                    !notification.read && "bg-muted"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn("p-2 rounded-full", getNotificationColor(notification.type))}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{notification.title}</p>
                        <div className="flex items-center gap-1">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => clearNotification(notification.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      {notification.action && (
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 h-auto"
                          asChild
                        >
                          <a href={notification.action.href}>{notification.action.label}</a>
                        </Button>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {notification.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
} 