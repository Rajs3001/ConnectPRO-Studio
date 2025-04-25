"use client";

// This component reuses the User Video Call page structure for simplicity.
// In a real application, you might have slightly different layouts or features
// for the professional's view.

import VideoCallPage from '@/app/user/video/[appointmentId]/page'; // Updated path
import AppLayout from '@/components/layouts/app-layout'; // Ensure this layout can handle 'professional' type

export default function ProfessionalVideoCallPage() {
    // The logic is handled by the imported component. We just wrap it
    // with the correct layout type if needed, though the component itself
    // might need internal adjustments based on user type prop if behavior differs.
    // For now, we assume the VideoCallPage component is flexible enough or
    // we accept identical UI for demo purposes.

    // If AppLayout needed specific things *only* for the professional view,
    // you might wrap it here, but VideoCallPage already includes AppLayout.
    // We can just render it directly.
    return <VideoCallPage />;

    // If VideoCallPage didn't include AppLayout, you'd do:
    /*
    return (
        <AppLayout userType="professional">
            <VideoCallPage /> // Assuming VideoCallPage doesn't render its own layout
        </AppLayout>
    );
    */
}
