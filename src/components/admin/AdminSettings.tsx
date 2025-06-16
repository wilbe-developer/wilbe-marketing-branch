
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SprintFeatureFlags } from './SprintFeatureFlags';
import LiveEventsManager from './LiveEventsManager';

const AdminSettings = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Admin Settings</h1>
        <p className="text-gray-500 mt-2">Configure platform settings</p>
      </div>
      
      <Tabs defaultValue="sprint">
        <TabsList className="mb-4">
          <TabsTrigger value="sprint">BSF Features</TabsTrigger>
          <TabsTrigger value="live-events">Live Events</TabsTrigger>
          <TabsTrigger value="analytics">Analytics Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sprint">
          <Card>
            <CardHeader>
              <CardTitle>BSF Feature Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <SprintFeatureFlags />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="live-events">
          <Card>
            <CardHeader>
              <CardTitle>Live Events Management</CardTitle>
            </CardHeader>
            <CardContent>
              <LiveEventsManager />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Available Analytics</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Waitlist Signups Analytics</li>
                    <li>BSF Signups Analytics</li>
                    <li>Conversion Metrics</li>
                    <li>Quiz Visit Analytics</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Analytics Settings</h3>
                  <p className="text-sm text-gray-600">
                    These analytics are available on the <a href="/admin/analytics" className="text-blue-600 underline">Analytics Dashboard</a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
