import { AdminRepository } from "repositories/admin-repository";

export class AdminService {
  constructor(private AdminRepository: AdminRepository) {}

  async fetchUsers() {
    try {
      const users = await this.AdminRepository.fetchAllUsers();
      if (!users) {
        return { status: 404, message: "No Users  available" };
      }

      return { status: 200, users: users };
    } catch (err) {
      console.error("Error occured in fetching users in admin service", err);
      return {
        status: 500,
        message: "Error occurred during fetching users in admin service",
      };
    }
  }

  async fetchReportPosts() {
    try {
      const posts = await this.AdminRepository.fetchReportPosts();
      if (!posts) {
        return { status: 404, message: "No posts availale" };
      }

      return { status: 200, posts: posts };
    } catch (err) {
      console.error("Error occured in fetching users in admin service", err);
      return {
        status: 500,
        message: "Error occurred during fetching users in admin service",
      };
    }
  }

  async unlistPost(postId:string) {
    try {
      const posts = await this.AdminRepository.unlistPost(postId);
      return { status: 200, message: 'Unlisted Successfully' };
    } catch (err) {
      console.error("Error occured in fetching users in admin service", err);
      return {
        status: 500,
        message: "Error occurred during fetching users in admin service",
      };
    }
  }

  async listPost(postId:string) {
    try {
      const posts = await this.AdminRepository.listPost(postId);
      return { status: 200, message: 'Unlisted Successfully' };
    } catch (err) {
      console.error("Error occured in fetching users in admin service", err);
      return {
        status: 500,
        message: "Error occurred during fetching users in admin service",
      };
    }
  }
}

