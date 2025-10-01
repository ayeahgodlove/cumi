"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";

export default function StudentCourseLearnPage() {
  const params = useParams();
  const router = useRouter();
  const { courseId } = params;

  // Redirect to the dashboard version
  React.useEffect(() => {
    if (courseId) {
      const currentUrl = window.location.href;
      const newUrl = currentUrl.replace('/student/courses/', '/dashboard/student/courses/');
      router.replace(newUrl);
    }
  }, [courseId, router]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h2>Redirecting to course learning page...</h2>
        <p>Please wait while we redirect you to the correct page.</p>
      </div>
    </div>
  );
}
