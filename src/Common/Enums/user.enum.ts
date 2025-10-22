enum RoleEnum{
    USER = "user",
    ADMIN = "admin"
}

enum GenderEnum{
    MALE = "male",
    FEMALE = "female",
    OTHER = "other"
}

enum ProviderEnum{
    GOOGLE = "google",
    LOCAL = "local"
}

enum OTPTypesEnum{
    ConfirmEmail = "confirmEmail",
    ResetPassword = "resetPassword",
    
}

enum FriendshipStatusEnum{
    PENDING = "pending",
    ACCEPTED = "accepted",
    REJECTED = "rejected"
}

export {RoleEnum, GenderEnum, ProviderEnum, OTPTypesEnum, FriendshipStatusEnum}
