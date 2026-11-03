import { z } from "zod";
import { billParamSchema } from "./schemas/bills.schema";
import { shareParamSchema } from "./schemas/share.schema";

const paramsSchema = z.object({
  ...billParamSchema.shape,
  ...shareParamSchema.shape
})

export {
  paramsSchema
} 

export {
  createHomeSchema,
  type createHomeInput,
} from "./schemas/home.schema";

export {
  createMemberSchema,
  homeParamSchema,
  type createMemberInput,
} from "./schemas/member.schema";

export {
  createBillSchema,
  type createBillInput,
} from "./schemas/bills.schema";


