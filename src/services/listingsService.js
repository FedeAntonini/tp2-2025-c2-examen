import { findAllListings, findListingById, findListingByPropertyType, findListingsWithTotalPrice, findListingsByHost, findUpdateListingAvailability , findTopHosts } from "../data/listingsData.js";

export const getListings = async (page, pageSize) => {
    return await findAllListings(page, pageSize);
}

export const getListingById = async (id) => {
    return await findListingById(id);
}

export const getListingByPropertyType = async (type, page, pageSize) => {
    return await findListingByPropertyType(type, page, pageSize);
}

export const getWithTotalPrice = async (page, pageSize) => {
    return await findListingsWithTotalPrice(page, pageSize);
}

export const getByHost = async (hostId) => {
    return await findListingsByHost(hostId);
}

export const updateListingAvailability = async (id, setDoc) => {
    return await findUpdateListingAvailability(id, setDoc);
}

export const getTopHostsService = async (limite) => {
    return await findTopHosts(limite);
}