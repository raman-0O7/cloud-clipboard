"use server";

import { prisma } from "@/lib/prisma";
import { ClipType } from "@prisma/client";

export const createClip = async (
	content: string,
	userId: string,
	type: ClipType,
	language?: string
) => {
	if (!content.trim()) return;
	const dataWithType = {
		content,
		userId,
		type,
		language: language?.trim() || null,
	};

	try {
		await prisma.clip.create({ data: dataWithType });
	} catch (e) {
		const msg = e instanceof Error ? e.message : "";
		if (
			msg.includes("Unknown argument") &&
			(msg.includes("type") || msg.includes("language"))
		) {
			// Fallback: create without type/language if client schema is outdated
			await prisma.clip.create({
				data: { content, userId, type: ClipType.TEXT },
			});
			return;
		}
		throw e;
	}
};
