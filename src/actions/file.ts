"use server";

import { FileChangeProps } from "@/components/file-save-form";
import { prisma } from "@/lib/prisma";

export const createFile = async (file: FileChangeProps, userId: string) => {
	if (!file.ufsUrl.trim() || !file.name || !file.size || !file.type) return;
	const mimeType = file.type.split("/").pop();
	if (!mimeType) return;
	await prisma.file.create({
		data: {
			userId,
			url: file.ufsUrl,
			mimeType,
			name: file.name,
			size: file.size,
		},
	});
};
