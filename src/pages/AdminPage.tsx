
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import ContentManagementTab from "@/components/admin/tabs/ContentManagementTab";
import UserApprovalsTab from "@/components/admin/tabs/UserApprovalsTab";
import SprintActivityTab from "@/components/admin/tabs/SprintActivityTab";
import PlatformSettingsTab from "@/components/admin/tabs/PlatformSettingsTab";
import TaskDefinitionsTab from "@/components/admin/tabs/TaskDefinitionsTab";
import { Link } from 'react-router-dom';
import { BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" asChild>
          <Link to="/admin/sprint-monitor" className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5" />
            Sprint Control Room
          </Link>
        </Button>
      </div>

      <Card>
        <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="sprint">Sprint</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="users" className="p-4">
            <UserApprovalsTab />
          </TabsContent>
          <TabsContent value="content" className="p-4">
            <ContentManagementTab />
          </TabsContent>
          <TabsContent value="sprint" className="p-4">
            <SprintActivityTab />
          </TabsContent>
          <TabsContent value="tasks" className="p-4">
            <TaskDefinitionsTab />
          </TabsContent>
          <TabsContent value="settings" className="p-4">
            <PlatformSettingsTab />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default AdminPage;
