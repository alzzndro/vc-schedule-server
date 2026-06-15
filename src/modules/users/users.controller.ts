import { UsersService } from "./users.service.js";
import { ApiResponse } from "../../utils/api-response.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { getParam } from "../../utils/params.js";
import { ApiError } from "../../utils/errors.js";

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await UsersService.getAllUsers();

  res.status(200).json(
    new ApiResponse({
      message: "Users fetched successfully",
      data: users,
    }),
  );
});

export const getMe = asyncHandler(async (req, res) => {
  // Safeguard check to ensure middleware worked and attached user payload
  if (!req.user?.userId) {
    throw new ApiError("User session state not found", 401);
  }

  const user = await UsersService.getUserById(req.user.userId);

  const { password_hash: _, ...sanitizedUser } = user;

  res.status(200).json(
    new ApiResponse({
      message: "Current user profile retrieved successfully",
      data: sanitizedUser,
    }),
  );
});

export const getUserById = asyncHandler(async (req, res) => {
  const id = getParam(req.params.id);
  const user = await UsersService.getUserById(id);

  res.status(200).json(
    new ApiResponse({
      message: "User fetched successfully",
      data: user,
    }),
  );
});

export const updateMyProfile = asyncHandler(async (req, res) => {
  if (!req.user?.userId) {
    throw new ApiError("User session state not found", 401);
  }

  const { firstName, lastName } = req.body;

  if (!firstName || !lastName) {
    throw new ApiError("First name and last name are required fields", 400);
  }

  const updatedUser = await UsersService.updateProfile(req.user.userId, {
    firstName,
    lastName,
  });

  res.status(200).json(
    new ApiResponse({
      message: "Profile details updated successfully",
      data: updatedUser,
    }),
  );
});

export const updateMyPassword = asyncHandler(async (req, res) => {
  if (!req.user?.userId) {
    throw new ApiError("User session state not found", 401);
  }

  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError("Both current and new passwords must be provided", 400);
  }

  if (currentPassword === newPassword) {
    throw new ApiError(
      "New password cannot be identical to your current password",
      400,
    );
  }

  await UsersService.updatePassword(req.user.userId, {
    currentPass: currentPassword,
    newPass: newPassword,
  });

  res.status(200).json(
    new ApiResponse({
      message: "Password changed successfully",
    }),
  );
});
