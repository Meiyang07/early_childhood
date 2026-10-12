import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { createProgramSchema, listProgramQuerySchema, programIdParamSchema, updateProgramSchema } from "../validators/program.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { createProgram, deleteProgram, listPrograms, updateProgram } from "../controllers/program.controller.js";


const programRouter = Router();

programRouter.get(
    "/list-program",
    validate({ query: listProgramQuerySchema }),
    asyncHandler(listPrograms)
);

programRouter.post(
    "/create-program",
    validate({ body: createProgramSchema }),
    asyncHandler(createProgram)
);


programRouter.patch(
    "/update/:id",
    validate({ params: programIdParamSchema, body: updateProgramSchema }),
    asyncHandler(updateProgram)
);

programRouter.delete(
    "/:id",
    validate({ params: programIdParamSchema }),
    asyncHandler(deleteProgram)
);

export default programRouter;