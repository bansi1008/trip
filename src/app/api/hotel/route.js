import { NextResponse } from "next/server";

import { GoogleGenAI } from "@google/genai";
import { getBudgetCategory } from "../../../lib/budgetCategorizer";

export async function POST(req) {
  try {
    const { country, dailyBudget } = await req.json();
    const category = getBudgetCategory(country, dailyBudget);

    return NextResponse.json({ category }, { status: 200 });
  } catch (error) {
    console.log(error);
  }
}
