export default (foo) => (req,res,next) => {
    Promise.resolve(foo(req,res, next)).catch(next)
}