import { useNavigate } from "react-router-dom";
import Button from "./Button"
import { Grid3X3, Heart, Home, User } from "lucide-react";

export const Footer = () => {
    const navigate = useNavigate();

    return (
        <div className="flex justify-around bg-white border-t py-3 mt-auto">
            <Button onClick={() => navigate('/')} className="flex flex-col items-center py-2">
                <Home className="w-6 h-6 mb-1" />
                <span className="text-xs">Home</span>
            </Button>
            <Button onClick={() => navigate('/categories')} className="flex flex-col items-center py-2">
                <Grid3X3 className="w-6 h-6 mb-1" />
                <span className="text-xs">Categories</span>
            </Button>
            <Button disabled onClick={() => navigate('/wishlist')} className="flex flex-col items-center py-2">
                <Heart className="w-6 h-6 mb-1" />
                <span className="text-xs">Wishlist</span>
            </Button>
            <Button disabled onClick={() => navigate('/profile')} className="flex flex-col items-center py-2">
                <User className="w-6 h-6 mb-1" />
                <span className="text-xs">Profile</span>
            </Button>
        </div>
    )
}