import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { PATHS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import VideoCarousel from "@/components/VideoCarousel";
import MemberPreview from "@/components/MemberPreview";
import ProfileCompletionDialog from "@/components/ProfileCompletionDialog";
import ApplicationPendingDialog from "@/components/ApplicationPendingDialog";
import { Lock, Clock } from "lucide-react";

const HomePage = () => {
  const { user, isMember } = useAuth();
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showPendingDialog, setShowPendingDialog] = useState(false);

  const handleNonMemberClick = () => {
    if (user?.membershipApplicationStatus === 'under_review') {
      setShowPendingDialog(true);
    } else {
      setShowProfileDialog(true);
    }
  };

  const handleShowPendingDialog = () => {
    setShowPendingDialog(true);
  };

  const renderMembershipBanner = () => {
    if (isMember) return null;

    if (user?.membershipApplicationStatus === 'under_review') {
      return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-blue-800">Application Under Review</h3>
          </div>
          <p className="text-blue-700 mb-3">
            We're reviewing your application and will notify you via email when you're approved as a member.
          </p>
        </div>
      );
    }

    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Lock className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-blue-800">Complete Your Profile</h3>
        </div>
        <p className="text-blue-700 mb-3">
          Complete your profile to access exclusive videos, connect with fellow scientists, and unlock premium features.
        </p>
        <Button size="sm" onClick={() => setShowProfileDialog(true)}>
          Complete Profile
        </Button>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <section className="mb-12">
        <h1 className="text-3xl font-bold mb-4">Welcome to Wilbe{user ? `, ${user.firstName}` : ""}</h1>
        <p className="text-lg mb-6">
          Your professional network for scientists exploring alternative careers in innovation and entrepreneurship.
        </p>
        {renderMembershipBanner()}
      </section>
      
      <section className="mb-12 allow-overflow-x">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Latest Videos</h2>
          {isMember ? (
            <Link to={PATHS.KNOWLEDGE_CENTER} className="text-brand-pink hover:underline">
              View All
            </Link>
          ) : (
            <div className="flex items-center gap-2 text-gray-500">
              <Lock className="h-4 w-4" />
              <span className="text-sm">Member access required</span>
            </div>
          )}
        </div>
        
        <VideoCarousel onNonMemberClick={handleNonMemberClick} />
      </section>
      
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-3">Knowledge Center</h2>
            <p className="text-gray-600 mb-4">
              Access expert insights and stories from scientists who have successfully navigated career transitions.
            </p>
            {isMember ? (
              <Button asChild>
                <Link to={PATHS.KNOWLEDGE_CENTER}>
                  Explore Videos
                </Link>
              </Button>
            ) : (
              <Button variant="outline" onClick={handleNonMemberClick}>
                <Lock className="h-4 w-4 mr-2" />
                {user?.membershipApplicationStatus === 'under_review' ? 'Application Under Review' : 'Complete Profile to Access'}
              </Button>
            )}
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-3">Member Directory</h2>
            <p className="text-gray-600 mb-4">
              Connect with like-minded scientists and entrepreneurs from around the world.
            </p>
            {isMember ? (
              <Button asChild>
                <Link to={PATHS.MEMBER_DIRECTORY}>
                  Browse Members
                </Link>
              </Button>
            ) : (
              <Button variant="outline" onClick={handleNonMemberClick}>
                <Lock className="h-4 w-4 mr-2" />
                {user?.membershipApplicationStatus === 'under_review' ? 'Application Under Review' : 'Complete Profile to Connect'}
              </Button>
            )}
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-3">Upcoming Events</h2>
            <p className="text-gray-600 mb-4">
              Join virtual and in-person events focused on science entrepreneurship and innovation.
            </p>
            <Button asChild>
              <Link to={PATHS.EVENTS}>
                View Calendar
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Community Members</h2>
          {isMember ? (
            <Link to={PATHS.MEMBER_DIRECTORY} className="text-brand-pink hover:underline">
              View All
            </Link>
          ) : (
            <div className="flex items-center gap-2 text-gray-500">
              <Lock className="h-4 w-4" />
              <span className="text-sm">Member access required</span>
            </div>
          )}
        </div>
        
        <MemberPreview onNonMemberClick={handleNonMemberClick} />
      </section>
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-bold mb-2">⚡ Ready to accelerate your science startup?</h2>
        <p className="mb-4">Join our Founder Sprint program and get personalized guidance to turn your scientific breakthrough into a successful venture.</p>
        <Link to={PATHS.SPRINT_SIGNUP}>
          <Button>Join the waitlist</Button>
        </Link>
      </div>

      <ProfileCompletionDialog 
        open={showProfileDialog} 
        onOpenChange={setShowProfileDialog}
        onShowPendingDialog={handleShowPendingDialog}
      />

      <ApplicationPendingDialog 
        open={showPendingDialog} 
        onOpenChange={setShowPendingDialog} 
      />
    </div>
  );
};

export default HomePage;
