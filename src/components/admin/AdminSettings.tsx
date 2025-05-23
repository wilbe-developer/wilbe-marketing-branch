
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SprintFeatureFlags } from './SprintFeatureFlags';

const AdminSettings = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Admin Settings</h1>
        <p className="text-gray-500 mt-2">Configure platform settings</p>
      </div>
      
      <Tabs defaultValue="sprint">
        <TabsList className="mb-4">
          <TabsTrigger value="sprint">Sprint Features</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sprint">
          <Card>
            <CardHeader>
              <CardTitle>Sprint Feature Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <SprintFeatureFlags />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
