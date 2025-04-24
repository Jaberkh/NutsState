import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";

// مسیر دیتابیس
const dbPath = "D:\\Nut\\V2\\Mini App\\sqlite\\dune_data.db";


export async function GET(request) {
  try {
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
      if (err) {
        console.error("Error connecting to database:", err);
        throw new Error("Database connection failed");
      }
    });

    const rows = await new Promise((resolve, reject) => {
      db.all(
        "SELECT all_time_peanut_count, daily_peanut_count, fid, parent_fid, rank, sent_peanut_count, total_peanut_count FROM peanut_data",
        (err, rows) => {
          if (err) {
            console.error("Error querying database:", err);
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });

    db.close();

    // تبدیل خروجی به فرمت مشابه Dune API
    const result = {
      result: {
        rows: rows.map((row) => ({
          all_time_peanut_count: row.all_time_peanut_count,
          daily_peanut_count: row.daily_peanut_count,
          fid: row.fid ? String(row.fid) : null,
          parent_fid: row.parent_fid ? String(row.parent_fid) : null,
          rank: row.rank,
          sent_peanut_count: row.sent_peanut_count,
          total_peanut_count: row.total_peanut_count,
        })),
      },
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: "Failed to fetch data from database" },
      { status: 500 }
    );
  }
}