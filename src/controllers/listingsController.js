import { getListings, getListingById, getWithTotalPrice, getByHost, updateListingAvailability, getTopHostsService, getListingByPropertyType } from "../services/listingsService.js";

export const getAllListings = async (req, res) => {
    try {
        const page = req.query.page ? parseInt(req.query.page) : undefined;
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : undefined;
        const listings = await getListings(page, pageSize);
        res.json(listings);
    } catch (error) {
        console.log("Error fetching listings: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getListingId = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id);
        const listing = await getListingById(id);
        res.json(listing);
    } catch (error) {
        console.log("Error fetching listing: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getListingsByPropertyType = async (req, res) => {
    try {
        const { type } = req.params;
        const page = req.query.page ? parseInt(req.query.page, 10) : undefined;
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize, 10) : undefined;

        if (!type || typeof type !== "string") {
            return res.status(400).json({ message: "Parametro: type invalido"});
        }

        if ((page && page < 1) || (pageSize && pageSize < 1)) {
            return res.status(400).json({ message: "page/pageSize deben ser enteros >= 1" })
        }
        const listings = await getListingByPropertyType(type, page, pageSize);
        return res.status(200).json(listings);
    } catch (error) {
        console.log("Error fetching listing by property type:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getListingsWithTotalPrice = async (req, res) => {
    try {
        const page = req.query.page ? parseInt(req.query.page, 10) : undefined;
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize, 10) : undefined;
        
        if ((page && page < 1) || (pageSize && pageSize < 1)) {
            return res.status(400).json({ message: "page/pageSize deben ser enteros >= 1" })
        }

        const listings = await getWithTotalPrice(page, pageSize);
        return res.status(200).json(listings);
    } catch (error) {
        console.log("Error fetching listings with totalPrice", error);
        return res.status(500).json({ message: "Error interno" })
    }
};

export const getListingByHost = async (req, res) => {
    try {
        const {host_id} = req.params;
        const page = req.query.page ? parseInt(req.query.page, 10) : undefined;
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize, 10) : undefined;

        if (!host_id) {
            return res.status(400).json({ message: "Falta el parametro host" });
        }

        if ((page && page < 1) || (pageSize && pageSize < 1)) {
            return res.status(400).json({ message: "page/pageSize deben ser enteros >= 1" })
        }

        const listings = await getByHost(host_id, page, pageSize);
        return res.status(200).json(listings);
    } catch (error) {
        console.log("Error fetching listings by host:", error);
        return res.status(500).json({ message: "Error interno" });
    }
};

export const updateAvailability = async (req, res) => {
    try {
        const { id } = req.params;
        const  {
            availability_30,
            availability_60,
            availability_90,
            availability_365
        } = req.body ?? {}
        
        const availabilityData = {}
        if (availability_30 !== undefined) availabilityData.availability_30 = Number(availability_30);
        if (availability_60 !== undefined) availabilityData.availability_60 = Number(availability_60);
        if (availability_90 !== undefined) availabilityData.availability_90 = Number(availability_90);
        if (availability_365 !== undefined) availabilityData.availability_365 = Number(availability_365);

        
        if (Object.keys(availabilityData).length === 0) {
            return res.status(400).json({ message: "No se envarion los campos para actualizar"});
        }
        
        const result = await updateListingAvailability(id, availabilityData);

        if (!result || result.matchedCount === 0) {
            return res.status(404).json({ message: "Listing no encontrado"});
        }

        return res.status(200).json({ message: " Disponibilidad actualizada" });
    } catch (error) {
        console.log("Error actualizando disponibilidad", error);
        return res.status(500).json({ message: "Internal server error"});
    }
};

export const getTopHosts = async (req, res) => {
    try {
        const limite = req.query.limite ? parseInt(req.query.limite, 10) : 10;
        const result = await getTopHostsService(limite);
        return res.status(200).json(result);
    } catch (error) {
        console.log("Error fetching top hosts:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


