//#region \0%23tanstack-start-server-fn-resolver
var manifest = {
	"001f301805823a9a33fb895039f6966747c37e6b00cf9d0ff65f0b2b1dc177f4": {
		functionName: "bookSteadfast_createServerFn_handler",
		importer: () => import("./couriers.functions-BVsAdItz.js")
	},
	"007261ee9d86e87592cfcd5491f56565cca84574c79db98974ab1951a1437f9d": {
		functionName: "getCatalogProduct_createServerFn_handler",
		importer: () => import("./catalog.functions-CR9_vD88.js")
	},
	"02213bd497c0eaf0a2687ab1b01d71f96e5763da0a2546216be66a5f5f034170": {
		functionName: "getActiveCouriers_createServerFn_handler",
		importer: () => import("./courier-config.functions-DyQDOHNx.js")
	},
	"06f673abc878ba68cd29da9f7f659e38d51f02519774e4f1f86005a1b0922cef": {
		functionName: "cancelCarrybee_createServerFn_handler",
		importer: () => import("./couriers.functions-BVsAdItz.js")
	},
	"09a36651d35e563d9fe3b0b7b020c13c911cd416bf36c415a9ad5b688016acb7": {
		functionName: "steadfastReturnRequests_createServerFn_handler",
		importer: () => import("./couriers.functions-BVsAdItz.js")
	},
	"0e5118af691349ef00122273a3f8e135bb8b024e71022d22ebc7d5586c787732": {
		functionName: "sendVerificationCode_createServerFn_handler",
		importer: () => import("./verification.functions-TVkAYARX.js")
	},
	"11f171b815abba951a9e9150a46ba78511c7bf9fac1f490e5c5aa41a9b84a5c1": {
		functionName: "listStaffUsers_createServerFn_handler",
		importer: () => import("./admin-users.functions-CK9HV4DS.js")
	},
	"13797c175a94746878249e5130933501e971965e8e0c193ee048e3d6bde0f18c": {
		functionName: "getCatalogProductSeo_createServerFn_handler",
		importer: () => import("./seo.functions-BbiXKrJ2.js")
	},
	"19348ddd96363e7d06426e105c0307ed9efe1817718075ff9b76d7d1c68d71cd": {
		functionName: "updateAdminUserAccount_createServerFn_handler",
		importer: () => import("./user-management.functions-DDMwzmSZ.js")
	},
	"1c875eb634cfe586e51886d964fbeba1cc0db5528949743be261340b655dde08": {
		functionName: "saveUploadedFileServer_createServerFn_handler",
		importer: () => import("./upload.functions-DIS24Sb5.js")
	},
	"1de17cc7f2793b21d06ee002aa5a238c2432ea1923fa9fc2527bf6ead15ef408": {
		functionName: "connectDomain_createServerFn_handler",
		importer: () => import("./cloudflare.functions-DFj6_rxR.js")
	},
	"2a45d9b79d4ba9547992f1eac18039c2bae0ddf7df7670a8638b3bf5e0a6962f": {
		functionName: "getCatalog_createServerFn_handler",
		importer: () => import("./catalog.functions-CR9_vD88.js")
	},
	"2d5e71d3e2ba36243c3b1a733b0fe4b540d79894c95517bfe0f13a6928e404ab": {
		functionName: "refreshDomain_createServerFn_handler",
		importer: () => import("./cloudflare.functions-DFj6_rxR.js")
	},
	"2d9d8cfdcf6b19c8238cf8cd192bbd5d9b4662f1786108f32222e3212ca125d2": {
		functionName: "deleteSupplier_createServerFn_handler",
		importer: () => import("./supplier-access.functions-BtVxNLK6.js")
	},
	"3a50e23ae2b20d88409e8a62e7626f41b7e47f3f6ee2a5a806856ef3b1c0b9f2": {
		functionName: "createAdminUser_createServerFn_handler",
		importer: () => import("./user-management.functions-DDMwzmSZ.js")
	},
	"3e1e835105145ed11d6462bb9008fc961d3864f55f9dfb385a0607be31e6a8e9": {
		functionName: "bookPathao_createServerFn_handler",
		importer: () => import("./couriers.functions-BVsAdItz.js")
	},
	"400a97eb346d0389219e8b1d28c9cb3c3ee2d543fde9b923d087e8976553f2cd": {
		functionName: "getStoreSeo_createServerFn_handler",
		importer: () => import("./seo.functions-BbiXKrJ2.js")
	},
	"5154d03a6ed76df0f43dc14445a211249a07639dedc8c8bfd9f4261231ef73c0": {
		functionName: "getPlatformOrigins_createServerFn_handler",
		importer: () => import("./cloudflare.functions-DFj6_rxR.js")
	},
	"5ef461c68e087dd3174ea95d6fccedbfbe64a7d53c821807d091838bcf528060": {
		functionName: "pathaoPricePlan_createServerFn_handler",
		importer: () => import("./couriers.functions-BVsAdItz.js")
	},
	"61be1c0e51703e4f38365275edd8a61e225ee9cf23862305e2715de694202738": {
		functionName: "testGatewayConnection_createServerFn_handler",
		importer: () => import("./gateways.functions-DmIKgnfG.js")
	},
	"68042aec30d5ed0b48916e0d1225d252ef3cba70b07e0d29d468d44d8d5f9d3b": {
		functionName: "runCleanup_createServerFn_handler",
		importer: () => import("./maintenance.functions-C62ii5u0.js")
	},
	"6ac466176123e702a9e1862b22d0b9ef078301e8886b40cb1f9908f5060c1ead": {
		functionName: "listActiveGateways_createServerFn_handler",
		importer: () => import("./gateways.functions-DmIKgnfG.js")
	},
	"6d957b9ba12c3420c9630abe8ef0652bbdf5e9715365b43336be564eb0b88891": {
		functionName: "notifyOrderStatus_createServerFn_handler",
		importer: () => import("./notifications.functions-C9Y0Y1gy.js")
	},
	"76e95cd3419397cb9224b68fd58494b99e1cbbf8f3c5acfbff89f796291816b6": {
		functionName: "getStoreProductSeo_createServerFn_handler",
		importer: () => import("./seo.functions-BbiXKrJ2.js")
	},
	"7a2fc6f207a5ff6162f1eb87faf4af12606a93357fe77592c73a780c9c7a3470": {
		functionName: "confirmUserEmail_createServerFn_handler",
		importer: () => import("./admin-users.functions-CK9HV4DS.js")
	},
	"7a3a61ebdab3f94d6b070d574b3b774d65713c6f8bc2cefca575d230ccf835ac": {
		functionName: "listDepositGateways_createServerFn_handler",
		importer: () => import("./gateways.functions-DmIKgnfG.js")
	},
	"7b3562bbc912086c55329f1cccc8e0a1d2108aeaf4fa9fc6cfdb4859cb91413a": {
		functionName: "saveRole_createServerFn_handler",
		importer: () => import("./roles-permissions.functions-DjkOnOKi.js")
	},
	"8bb5e209c418913d27ff81a0997bec8bfe2a2d6ed727ae8e1f4b1f36eecb9bf7": {
		functionName: "trackPurchaseServer_createServerFn_handler",
		importer: () => import("./capi.functions-B5ZD00XB.js")
	},
	"8fe8ad3eb41b179115dbad77ceb6946368cd1edd70577f36cff92291c6657f25": {
		functionName: "deleteRole_createServerFn_handler",
		importer: () => import("./roles-permissions.functions-DjkOnOKi.js")
	},
	"9206c2c485c931b124bb366ad679dd49c7bf9890ecb6f6df5ad02c908be2c810": {
		functionName: "cleanupStats_createServerFn_handler",
		importer: () => import("./maintenance.functions-C62ii5u0.js")
	},
	"97475f4e40a1db424670c9b39d952f4cf25210e54fcc58f1c87fddaa47984a70": {
		functionName: "carrybeeReversePickup_createServerFn_handler",
		importer: () => import("./couriers.functions-BVsAdItz.js")
	},
	"9866f76328537afcd342bb1462aec6c6ae4b18546f6c8c8eb5b12fe84b9c6aa1": {
		functionName: "getOrderDetails_createServerFn_handler",
		importer: () => import("./order-details.functions-DYt2QD5R.js")
	},
	"991da20e038601bf91e8fbcb431eb8700d1ebdfa16fdacef4672e69af0dc485c": {
		functionName: "deleteAuthUser_createServerFn_handler",
		importer: () => import("./admin-users.functions-CK9HV4DS.js")
	},
	"9d6e794ab8f26c61a73ea28db60b7d61d269e41358ad3761d166fd9eb8f96658": {
		functionName: "impersonateSupplier_createServerFn_handler",
		importer: () => import("./supplier-access.functions-BtVxNLK6.js")
	},
	"a5de8b020430b7345a07814f917cefc9f643090a71a3becd5e4f611c50f9d888": {
		functionName: "updateAdminUserPassword_createServerFn_handler",
		importer: () => import("./user-management.functions-DDMwzmSZ.js")
	},
	"a649084848d150e1b203a2c66abd3fbfae058d55017c2c8f8b69b4fcef3c0d14": {
		functionName: "getRoles_createServerFn_handler",
		importer: () => import("./roles-permissions.functions-DjkOnOKi.js")
	},
	"a7122c479165993c9847f8ed25ac7808c73036e56e6cc39481cd1e8428bb2ae9": {
		functionName: "getPermissions_createServerFn_handler",
		importer: () => import("./roles-permissions.functions-DjkOnOKi.js")
	},
	"a87394ade9e07fcb6800ba5b6e57ae4c915ca4d0514b5da41cd7c28310de862c": {
		functionName: "recheckCourierStatus_createServerFn_handler",
		importer: () => import("./order-details.functions-DYt2QD5R.js")
	},
	"aa38052ba1ea57d4f2ebac1ba15438d82f607703322e9bb22a67a0a40503254f": {
		functionName: "listDomains_createServerFn_handler",
		importer: () => import("./cloudflare.functions-DFj6_rxR.js")
	},
	"aacdf5781b98bc48cc6a146e3461e151efb2f0722ac439a7ac3d790f5416c459": {
		functionName: "getDnsGuide_createServerFn_handler",
		importer: () => import("./cloudflare.functions-DFj6_rxR.js")
	},
	"ad6ef247475c902e18bc71afbbca020f384d3c528809b5911f2fd3760d963ca4": {
		functionName: "deleteUploadedFileServer_createServerFn_handler",
		importer: () => import("./upload.functions-DIS24Sb5.js")
	},
	"ade31f0e85e821c0c9984553cd0af6a3ac9c2f9f0bbbc71b11174056b684ac4a": {
		functionName: "getCloudflareConfig_createServerFn_handler",
		importer: () => import("./cloudflare.functions-DFj6_rxR.js")
	},
	"af4a642ab2d69f88752b6f42a86d288f49c60e668c186ad36570e8c718a6ef64": {
		functionName: "autoSyncCourierStatuses_createServerFn_handler",
		importer: () => import("./couriers.functions-BVsAdItz.js")
	},
	"aff1d786710b9d77b701bd384f82b9cb5f8077df2c8ed8bba29d96454eed4d3c": {
		functionName: "steadfastBalance_createServerFn_handler",
		importer: () => import("./couriers.functions-BVsAdItz.js")
	},
	"b0c7ea11b96f2e34c093f44892c4072d9d211f574f6f6d096d007888e9a227c8": {
		functionName: "startDepositPayment_createServerFn_handler",
		importer: () => import("./gateways.functions-DmIKgnfG.js")
	},
	"b1692f83eddd1d94d500e5008624c86decb80d533d3107b5819fdcc9069fcba5": {
		functionName: "updateAdminUserRole_createServerFn_handler",
		importer: () => import("./user-management.functions-DDMwzmSZ.js")
	},
	"b18dc65a5f691f980c59625d8d1a51d04d874a911a87888db07e04793dafe02c": {
		functionName: "pathaoStores_createServerFn_handler",
		importer: () => import("./couriers.functions-BVsAdItz.js")
	},
	"b2f365d22f7d0d90f0f364eff697e0e33d81d572fbef647481171a0b6069cc9d": {
		functionName: "savePlatformOrigins_createServerFn_handler",
		importer: () => import("./cloudflare.functions-DFj6_rxR.js")
	},
	"b3f65dc7e408d66c19ba4b4808a75ccd758898f7c3060c9742d56016735f0843": {
		functionName: "sendTestNotification_createServerFn_handler",
		importer: () => import("./notifications.functions-C9Y0Y1gy.js")
	},
	"bef903bab9cf2b0f29f9fa1bfc90eb8b722537c0da4b2a8ed9c0698ec8d2b581": {
		functionName: "resetSupplierPassword_createServerFn_handler",
		importer: () => import("./supplier-access.functions-BtVxNLK6.js")
	},
	"bf9fef4de90b0c28b27f72e812816bf09ba4d58c398bb34af3a5cd424483b5a2": {
		functionName: "syncPathaoStatus_createServerFn_handler",
		importer: () => import("./couriers.functions-BVsAdItz.js")
	},
	"c24f72c85b41724a74a1745027f025f52b52eb3c4ebca1226865ec5a765fb1b1": {
		functionName: "getSiteSeo_createServerFn_handler",
		importer: () => import("./seo.functions-BbiXKrJ2.js")
	},
	"c26c98eccbf050f9e75273e64ae1e834863c11cb55676e87694e5630f398daf9": {
		functionName: "bookCarrybee_createServerFn_handler",
		importer: () => import("./couriers.functions-BVsAdItz.js")
	},
	"c41a7d0b1f28e54b9c352b35533fa84681a2c8fb53baa30b0239472d18099044": {
		functionName: "resetResellerPassword_createServerFn_handler",
		importer: () => import("./reseller-access.functions-3i_jLmQ7.js")
	},
	"c466d25b6b17dbdf3f48540f96fec6c096d61bacfa4b597c6d9b6daedb8257da": {
		functionName: "fetchImportImage_createServerFn_handler",
		importer: () => import("./product-import.functions-BkOHYtny.js")
	},
	"c6c49de3f6491227dbde551eed3b3c2bcc4231efb3b653002613be16142ca04e": {
		functionName: "syncSteadfastStatus_createServerFn_handler",
		importer: () => import("./couriers.functions-BVsAdItz.js")
	},
	"c6f99ee48e8966e2cf5d9809672b059b3eee14dd1a20f71e0a9e7958484aec51": {
		functionName: "verifyGatewayPayment_createServerFn_handler",
		importer: () => import("./gateways.functions-DmIKgnfG.js")
	},
	"c73cecbaf7348f9b524e70bab5e2011554ed424328568749bec2a7e553ed6610": {
		functionName: "getCourierBookingOptions_createServerFn_handler",
		importer: () => import("./courier-config.functions-DyQDOHNx.js")
	},
	"cbee74248449b8a4d553cd0324b2a8d9655c29f66702f8f06d81f81ef42b0d63": {
		functionName: "steadfastCreateReturn_createServerFn_handler",
		importer: () => import("./couriers.functions-BVsAdItz.js")
	},
	"cc007cf8ae2a66d9f97322ac2249116a514a5c0cf420d3fdb9c5b408a9499ee5": {
		functionName: "startGatewayPayment_createServerFn_handler",
		importer: () => import("./gateways.functions-DmIKgnfG.js")
	},
	"d5dc6b97d303a369fb80b25d5071fcb7fc72bcb783d35eb1004728e1efbb00d5": {
		functionName: "disconnectDomain_createServerFn_handler",
		importer: () => import("./cloudflare.functions-DFj6_rxR.js")
	},
	"d8291a8798f81d4da562d493e9e37a818e176a9a438b9e18f1603244e947944d": {
		functionName: "listResellerEmailStatus_createServerFn_handler",
		importer: () => import("./admin-users.functions-CK9HV4DS.js")
	},
	"d8978ff6672fba1f7d9bfef74a7e9a0a679ddbc8c54dad6e4c22e2039f485e49": {
		functionName: "listAgentCandidates_createServerFn_handler",
		importer: () => import("./agents.functions-C38TXAXF.js")
	},
	"e3d33cd807c704c01bb2e3fb9ae87fed5f52f1b93e3a5af134dbffd0d3a9cfe0": {
		functionName: "carrybeeExchange_createServerFn_handler",
		importer: () => import("./couriers.functions-BVsAdItz.js")
	},
	"e681b5bcf4d58665c92b49d188b4328094cbb5aacf7e0b26307702f8603d300e": {
		functionName: "saveCloudflareConfig_createServerFn_handler",
		importer: () => import("./cloudflare.functions-DFj6_rxR.js")
	},
	"efa9c1cc7e47e394a824fe343d7aec5795c6ffd99d57a9bb24b4fe67ce773ea1": {
		functionName: "carrybeeStores_createServerFn_handler",
		importer: () => import("./couriers.functions-BVsAdItz.js")
	},
	"f58ccdc3f930a666d9481586d8f27f89c5fb10084df43473a57064dd6763c684": {
		functionName: "receiveReturn_createServerFn_handler",
		importer: () => import("./couriers.functions-BVsAdItz.js")
	},
	"f6aedff16c5414dd6af4bbe284597f8a5ec8f2970dcd28e0deddc7b1a23b3ad1": {
		functionName: "syncCarrybeeStatus_createServerFn_handler",
		importer: () => import("./couriers.functions-BVsAdItz.js")
	},
	"f7d2b7addd0fda66bd511042fa2856a7a8ca6d28c6b804821ec09834178fc07d": {
		functionName: "testCloudflareConfig_createServerFn_handler",
		importer: () => import("./cloudflare.functions-DFj6_rxR.js")
	},
	"f850d332dd0e3b844c6b95e0be03c053ad6d2dfe841a14c555f128a49f6957dc": {
		functionName: "impersonateReseller_createServerFn_handler",
		importer: () => import("./reseller-access.functions-3i_jLmQ7.js")
	},
	"fa2d8575432f23be6da68030eb418b5b7a3130a5a3fb69d3b266b5fc82073749": {
		functionName: "importProductFromUrl_createServerFn_handler",
		importer: () => import("./product-import.functions-BkOHYtny.js")
	},
	"faaa580fd4cb98d1b12ecb9e0bb7a060ab3975a86f23abb9e6be865e25d51865": {
		functionName: "setPrimaryDomain_createServerFn_handler",
		importer: () => import("./cloudflare.functions-DFj6_rxR.js")
	},
	"fb8fea5715b0cf7179cee49a1f11af1632252f5c4e3e6ae929be57d45a4a1418": {
		functionName: "listUploadedFilesServer_createServerFn_handler",
		importer: () => import("./upload.functions-DIS24Sb5.js")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
