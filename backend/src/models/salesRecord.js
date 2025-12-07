export function mapRawRowToSalesRecord(row) {
  return {
    customerId: row["Customer ID"],
    customerName: row["Customer Name"],
    phoneNumber: row["Phone Number"],
    gender: row["Gender"],
    age: Number(row["Age"]) || null,
    customerRegion: row["Customer Region"],
    customerType: row["Customer Type"],

    productId: row["Product ID"],
    productName: row["Product Name"],
    brand: row["Brand"],
    productCategory: row["Product Category"],
    tags: row["Tags"] ? row["Tags"].split(",").map(t => t.trim()) : [],

    quantity: Number(row["Quantity"]) || 0,
    pricePerUnit: Number(row["Price per Unit"]) || 0,
    discountPercentage: Number(row["Discount Percentage"]) || 0,
    totalAmount: Number(row["Total Amount"]) || 0,
    finalAmount: Number(row["Final Amount"]) || 0,

    date: row["Date"],
    paymentMethod: row["Payment Method"],
    orderStatus: row["Order Status"],
    deliveryType: row["Delivery Type"],
    storeId: row["Store ID"],
    storeLocation: row["Store Location"],
    salespersonId: row["Salesperson ID"],
    employeeName: row["Employee Name"]
  };
}
