import { NextRequest, NextResponse } from "next/server";
import { PostRepository } from "@data/repositories/impl/post.repository";
import { UserRepository } from "@data/repositories/impl/user.repository";
import { EventRepository } from "@data/repositories/impl/event.repository";
import { CourseRepository } from "@data/repositories/impl/course.repository";
import { ProjectRepository } from "@data/repositories/impl/project.repository";
import { ServiceRepository } from "@data/repositories/impl/service.repository";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Initialize repositories
    const postRepository = new PostRepository();
    const userRepository = new UserRepository();
    const eventRepository = new EventRepository();
    const courseRepository = new CourseRepository();
    const projectRepository = new ProjectRepository();
    const serviceRepository = new ServiceRepository();

    // Fetch counts - only public data
    const [
      totalUsers,
      totalPosts,
      totalEvents,
      totalCourses,
      totalProjects,
      totalServices
    ] = await Promise.all([
      userRepository.getAll().then(users => users.length).catch(() => 0),
      postRepository.getAll().then(posts => posts.filter((p: any) => p.status === 'published').length).catch(() => 0),
      eventRepository.getAll().then(events => events.length).catch(() => 0),
      courseRepository.getAll().then(courses => courses.length).catch(() => 0),
      projectRepository.getAll().then(projects => projects.length).catch(() => 0),
      serviceRepository.getAll().then(services => services.length).catch(() => 0)
    ]);

    const stats = {
      totalProjects,
      totalServices,
      totalPosts,
      totalEvents,
      totalCourses,
      totalUsers
    };
    
    return NextResponse.json(stats);

  } catch (error: any) {
    console.error('Error fetching public stats:', error);
    return NextResponse.json(
      {
        totalProjects: 0,
        totalServices: 0,
        totalPosts: 0,
        totalEvents: 0,
        totalCourses: 0,
        totalUsers: 0
      },
      { status: 200 }
    );
  }
}

