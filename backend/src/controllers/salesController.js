import { querySales } from "../services/salesService.js";

export function getSales(req, res) {
  try {
    const {
      search,
      regions,
      genders,
      ageMin,
      ageMax,
      productCategories,
      tags,
      paymentMethods,
      dateStart,
      dateEnd,
      sortBy,
      sortOrder,
      page,
      pageSize
    } = req.query;

    const result = querySales({
      search,
      regions,
      genders,
      ageMin,
      ageMax,
      productCategories,
      tags,
      paymentMethods,
      dateStart,
      dateEnd,
      sortBy,
      sortOrder,
      page,
      pageSize: pageSize ? Number(pageSize) : 10
    });

    res.json(result);
  } catch (err) {
    console.error("Error in getSales:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}
