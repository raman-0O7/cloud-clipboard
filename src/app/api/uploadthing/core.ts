import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const handleAuth = async () => {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session || !session.user.id) {
		throw new UploadThingError("Unauthorized");
	}
	return { userId: session.user.id };
};

export const ourFileRouter = {
	file: f(["image", "pdf", "blob", "text"])
		.middleware(() => handleAuth())
		.onUploadComplete((res) => {console.log("fil router",res)}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
