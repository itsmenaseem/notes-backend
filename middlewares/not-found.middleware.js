
export function notFoundMiddleware (req,res) {
    return res.status(404).json({
        success:false,
        message:"Resources not Found"
    })
}