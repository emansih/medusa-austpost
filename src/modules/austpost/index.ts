import { ModuleProvider, Modules } from "@medusajs/framework/utils";
import AustPostFulfillmentProviderService from "./service";


export default ModuleProvider(Modules.FULFILLMENT, {
    services: [AustPostFulfillmentProviderService],
})