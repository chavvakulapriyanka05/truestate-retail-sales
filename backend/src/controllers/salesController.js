// backend/src/controllers/salesController.js
import mongoose from "mongoose";

// This is the same collection you imported your CSV into.
// If you already have a model, import that instead.
const Sales = mongoose.connection.collection("sales");

/**
 * Helper: turn "North,South" OR ["North","South"] into ["North","South"]
 */
function parseList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return String(value)
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

/**
 * GET /api/sales
 * Supports:
 *  - search
 *  - page, pageSize
 *  - sortBy: "date" | "amount" | "qty"
 *  - sortOrder: "asc" | "desc"
 *  - regions: "North,South"
 *  - genders: "Male,Female"
 *  - categories: "Beauty,Electronics"
 *  - tags: "organic,skincare"
 *  - paymentMethods: "Cash,UPI,Wallet"
 *  - ageMin, ageMax
 *  - dateStart, dateEnd  (YYYY-MM-DD)
 */
export async function getSales(req, res) {
  try {
    const {
      search = "",
      page = 1,
      pageSize = 10,
      sortBy = "date",
      sortOrder = "desc",
      regions,
      genders,
      categories,
      tags,
      paymentMethods,
      ageMin,
      ageMax,
      dateStart,
      dateEnd,
    } = req.query;

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const sizeNum = Math.max(parseInt(pageSize, 10) || 10, 1);

    const filter = {};

    // -------- Search (customer name / phone) --------
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [
        { "Customer Name": regex },
        { "Phone Number": regex },
      ];
    }

    // -------- Multi-select filters --------
    const regionList = parseList(regions);
    if (regionList.length) {
      filter["Customer Region"] = { $in: regionList };
    }

    const genderList = parseList(genders);
    if (genderList.length) {
      filter.Gender = { $in: genderList };
    }

    const categoryList = parseList(categories);
    if (categoryList.length) {
      filter["Product Category"] = { $in: categoryList };
    }

    const tagList = parseList(tags);
    if (tagList.length) {
      // CSV imported as "tag1,tag2"; match if any selected tag is contained
      filter.Tags = { $in: tagList };
    }

    const pmList = parseList(paymentMethods);
    if (pmList.length) {
      filter["Payment Method"] = { $in: pmList };
    }

    // -------- Age range --------
    if (ageMin || ageMax) {
      const ageFilter = {};
      if (ageMin) ageFilter.$gte = Number(ageMin);
      if (ageMax) ageFilter.$lte = Number(ageMax);
      filter.Age = ageFilter;
    }

    // -------- Date range --------
    if (dateStart || dateEnd) {
      const dateFilter = {};
      if (dateStart) {
        dateFilter.$gte = new Date(dateStart);
      }
      if (dateEnd) {
        const end = new Date(dateEnd);
        // include whole end day
        end.setHours(23, 59, 59, 999);
        dateFilter.$lte = end;
      }
      filter.Date = dateFilter;
    }

    // -------- Sorting --------
    const sort = {};
    let sortField = "Date";

    if (sortBy === "amount") {
      sortField = "Final Amount";
    } else if (sortBy === "qty") {
      sortField = "Quantity";
    }

    sort[sortField] = sortOrder === "asc" ? 1 : -1;

    const skip = (pageNum - 1) * sizeNum;

    // -------- Query DB --------
    const [items, totalItems] = await Promise.all([
      Sales.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(sizeNum)
        .toArray(),
      Sales.countDocuments(filter),
    ]);

    const totalPages = Math.max(Math.ceil(totalItems / sizeNum), 1);

    res.json({
      meta: {
        page: pageNum,
        pageSize: sizeNum,
        totalItems,
        totalPages,
      },
      data: items,
    });
  } catch (err) {
    console.error("Error in getSales:", err);
    res.status(500).json({ error: "Failed to load sales data" });
  }
}
