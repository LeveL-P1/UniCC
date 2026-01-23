'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Bell, Shield, Database, Trash2 } from 'lucide-react'

export default function SettingsPage() {
    const [saving, setSaving] = useState(false)
    const [settings, setSettings] = useState({
        displayName: '',
        email: '',
        notifications: {
            email: true,
            push: false,
            weeklyReport: true
        }
    })

    const handleSave = async () => {
        setSaving(true)
        // Simulate save
        await new Promise(resolve => setTimeout(resolve, 1000))
        setSaving(false)
    }

    return (
        <DashboardLayout>
            <div className="p-6 space-y-8 max-w-4xl">

                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <h1 className="text-4xl font-outfit font-bold tracking-tight">
                        Settings
                    </h1>
                    <p className="text-sm text-muted-foreground mt-2">
                        Manage your account settings and preferences
                    </p>
                </motion.div>

                {/* Profile Settings */}
                <Card title="PROFILE" collapsible>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                                <User size={32} className="text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Profile Picture</h3>
                                <p className="text-sm text-muted-foreground">Managed by Clerk authentication</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="displayName">Display Name</Label>
                            <Input
                                id="displayName"
                                placeholder="Your name"
                                value={settings.displayName}
                                onChange={(e) => setSettings({ ...settings, displayName: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="your.email@example.com"
                                value={settings.email}
                                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                disabled
                            />
                            <p className="text-xs text-muted-foreground">Email is managed by Clerk authentication</p>
                        </div>
                    </div>
                </Card>

                {/* Notification Settings */}
                <Card title="NOTIFICATIONS" collapsible>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Bell size={20} className="text-primary" />
                                <div>
                                    <p className="font-medium">Email Notifications</p>
                                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSettings({
                                    ...settings,
                                    notifications: { ...settings.notifications, email: !settings.notifications.email }
                                })}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notifications.email ? 'bg-primary' : 'bg-secondary'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notifications.email ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Bell size={20} className="text-primary" />
                                <div>
                                    <p className="font-medium">Push Notifications</p>
                                    <p className="text-sm text-muted-foreground">Receive browser notifications</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSettings({
                                    ...settings,
                                    notifications: { ...settings.notifications, push: !settings.notifications.push }
                                })}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notifications.push ? 'bg-primary' : 'bg-secondary'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notifications.push ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Database size={20} className="text-primary" />
                                <div>
                                    <p className="font-medium">Weekly Progress Report</p>
                                    <p className="text-sm text-muted-foreground">Get a summary of your coding practice</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSettings({
                                    ...settings,
                                    notifications: { ...settings.notifications, weeklyReport: !settings.notifications.weeklyReport }
                                })}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notifications.weeklyReport ? 'bg-primary' : 'bg-secondary'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notifications.weeklyReport ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                    </div>
                </Card>

                {/* Privacy & Security */}
                <Card title="PRIVACY & SECURITY" collapsible>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50">
                            <Shield size={20} className="text-primary" />
                            <div className="flex-1">
                                <p className="font-medium">Authentication</p>
                                <p className="text-sm text-muted-foreground">
                                    Your account is secured with Clerk authentication
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50">
                            <Database size={20} className="text-primary" />
                            <div className="flex-1">
                                <p className="font-medium">Data Privacy</p>
                                <p className="text-sm text-muted-foreground">
                                    Your coding practice data is stored securely
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Danger Zone */}
                <Card title="DANGER ZONE" collapsible defaultCollapsed>
                    <div className="space-y-4">
                        <div className="p-4 rounded-lg border border-destructive/50 bg-destructive/5">
                            <div className="flex items-start gap-3">
                                <Trash2 size={20} className="text-destructive mt-0.5" />
                                <div className="flex-1">
                                    <h4 className="font-semibold text-destructive">Delete All Data</h4>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Permanently delete all your coding sessions and statistics. This action cannot be undone.
                                    </p>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="mt-3"
                                        onClick={() => {
                                            if (confirm('Are you sure? This will permanently delete all your data.')) {
                                                alert('Data deletion is not implemented in this demo')
                                            }
                                        }}
                                    >
                                        Delete All Data
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Save Button */}
                <div className="flex justify-end gap-3 pt-4">
                    <Button
                        variant="outline"
                        onClick={() => window.location.reload()}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </div>
        </DashboardLayout>
    )
}
