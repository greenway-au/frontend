/**
 * Settings Route
 * User and application settings
 */

import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Switch } from '@workspace/ui/components/switch';
import { useAtom } from 'jotai';
import { themeAtom, type Theme } from '@/stores/ui';
import { userPreferencesAtom } from '@/stores/preferences';

export const Route = createFileRoute('/_dashboard/settings')({
  component: SettingsPage,
});

function SettingsPage() {
  const [theme, setTheme] = useAtom(themeAtom);
  const [preferences, setPreferences] = useAtom(userPreferencesAtom);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  const handleNotificationChange = (key: keyof typeof preferences.notifications, value: boolean) => {
    setPreferences({
      ...preferences,
      notifications: {
        ...preferences.notifications,
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account and application preferences"
      />

      <div className="grid gap-6">
        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how the dashboard looks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Theme</p>
                <p className="text-sm text-muted-foreground">Select your preferred theme</p>
              </div>
              <div className="flex gap-2">
                {(['light', 'dark', 'system'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => handleThemeChange(t)}
                    className={`px-3 py-1 rounded-md text-sm ${
                      theme === t
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Choose what notifications you receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive updates via email</p>
              </div>
              <Switch
                checked={preferences.notifications.email}
                onCheckedChange={(checked) => handleNotificationChange('email', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Receive push notifications</p>
              </div>
              <Switch
                checked={preferences.notifications.push}
                onCheckedChange={(checked) => handleNotificationChange('push', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">In-App Notifications</p>
                <p className="text-sm text-muted-foreground">Show notifications in the app</p>
              </div>
              <Switch
                checked={preferences.notifications.inApp}
                onCheckedChange={(checked) => handleNotificationChange('inApp', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Display Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Display Preferences</CardTitle>
            <CardDescription>Customize data display settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Items Per Page</p>
                <p className="text-sm text-muted-foreground">Number of items shown in lists</p>
              </div>
              <select
                value={preferences.itemsPerPage}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    itemsPerPage: Number(e.target.value) as 10 | 20 | 50 | 100,
                  })
                }
                className="rounded-md border bg-background px-3 py-1"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Date Format</p>
                <p className="text-sm text-muted-foreground">How dates are displayed</p>
              </div>
              <select
                value={preferences.dateFormat}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    dateFormat: e.target.value as typeof preferences.dateFormat,
                  })
                }
                className="rounded-md border bg-background px-3 py-1"
              >
                <option value="dd/MM/yyyy">DD/MM/YYYY</option>
                <option value="MM/dd/yyyy">MM/DD/YYYY</option>
                <option value="yyyy-MM-dd">YYYY-MM-DD</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
