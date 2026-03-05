import axios from "axios";

const api = "http://localhost:9000/api/products"

export const fetchProduct = async () => {
    try {
        const response = await axios.get(api)
        console.log("response", response)
    } catch (error) {
        console.error(error)
    }
}