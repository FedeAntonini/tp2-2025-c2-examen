import { parseIntP } from "../helpers/parseNumber.js";
import { getDb } from "./connection.js";

export async function findAllListings(page, pageSize) {
    const db = getDb();
    if (page && pageSize) {
        const skip = (page - 1) * pageSize;
        const listings = await db.collection("listingsAndReviews")
            .find()
            .skip(skip)
            .limit(pageSize)
            .toArray();
        return listings;
    } else {
        // Sin paginación: trae todos los documentos
        const listings = await db.collection("listingsAndReviews").find().toArray();
        return listings;
    }
}

export async function findListingById(id) {
    const db = getDb();
    const listing = await db.collection("listingsAndReviews").findOne({ _id: id });
    console.log(listing);
    return listing;
}

export async function findListingByPropertyType(type, page, pageSize) {
    const db = getDb();
    if (page && pageSize) {
        const skip = (page - 1) * pageSize;
        const listings = await db.collection("listingsAndReviews")
            .find({ property_type: type})
            .skip(skip)
            .limit(pageSize)
            .toArray();
        return listings;
    } else {
        const listings = await db.collection("listingsAndReviews").find({property_type: type}).toArray();
        return listings;
    }
}

export async function findListingsWithTotalPrice(page, pageSize) {
    const db = getDb();
    let listings = [];
    if (page && pageSize) {
        const skip = (page - 1) * pageSize;
        listings = await db.collection("listingsAndReviews")
            .find()
            .skip(skip)
            .limit(pageSize)
            .toArray();
    } else {
        listings = await db.collection("listingsAndReviews").find().toArray();
    }

    return listings.map((d) => {
        const price = parseIntP(d.price);
        const clean = parseIntP(d.cleaning_fee);
        const deposit = parseIntP(d.security_deposit);
        const extra = parseIntP(d.extra_people);
    return { ...d, totalPrice: price + clean + deposit + extra };
    });
}

export async function findListingsByHost(hostId, page, pageSize) {
    const db = getDb();
    if (page && pageSize) {
        const skip = (page - 1) * pageSize;
        const listings = await db.collection("listingsAndReviews")
            .find({"host.host_id": hostId})
            .skip(skip)
            .limit(pageSize)
            .toArray();
        return listings;
    } else {
        const listings = await db.collection("listingsAndReviews").find({"host.host_id": hostId}).toArray();
        return listings;
    }
}

export async function findUpdateListingAvailability(id, availabilityData) {
    const db = getDb();
    const actualizar = {};

    if (availabilityData.availability_30 !== undefined) {
        actualizar["availability.availability_30"] = availabilityData.availability_30;
    }

    if (availabilityData.availability_60 !== undefined) {
        actualizar["availability.availability_60"] = availabilityData.availability_60;
    }

    if (availabilityData.availability_90 !== undefined) {
        actualizar["availability.availability_90"] = availabilityData.availability_90;
    }

    if (availabilityData.availability_365 !== undefined) {
        actualizar["availability.availability_365"] = availabilityData.availability_365;
    }

    const result = await db.collection("listingsAndReviews").updateOne(
        {_id:id},
        {$set: actualizar}
    )

    return result;
}

export async function findTopHosts(limite) {
    const db = getDb();
    const listings = await db.collection("listingsAndReviews")
        .find()
        .toArray()

    const hostTotalProperties = {}
    const hostData = {}
    for (let listing of listings) {
        const id = listing.host.host_id
        hostTotalProperties[id] === undefined ? hostTotalProperties[id] = 1 : hostTotalProperties[id]++
        hostData[id] = listing.host
    }

    const results = Object.keys(hostTotalProperties)
        .sort((a, b) => hostTotalProperties[b] - hostTotalProperties[a])
        .slice(0, limite)

    return results.map(k => ({
        ...hostData[k],
        totalProperties: hostTotalProperties[k],
    }))
}
        

