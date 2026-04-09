import mongoose from 'mongoose'
import bcrypt from "bcryptjs"
import isEmail from 'validator/lib/isEmail.js'

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: (value) => isEmail(value),
                message: props => `${props.value} is not a valid email!`
            }
        },
        fullName: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            minlength: [6, "Password must be 6 characters or longer!"],
        },
        profilePic: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
)

userSchema.pre('save', async function () {
    if (!this.isModified("password")) return;

    try {
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        console.error("Error while hashing passowrd", error);
        throw new Error('Internal server error');
    }
});

const User = mongoose.model('User', userSchema);
export default User;