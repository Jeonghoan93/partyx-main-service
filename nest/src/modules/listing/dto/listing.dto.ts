export interface UserDTO {
  createdAt: string;
  updatedAt: string;
  emailVerified: string;
}

export interface ListingDTO {
  createdAt: string;
  user: UserDTO;
}
