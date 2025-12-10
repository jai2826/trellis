import { v } from "convex/values";
// import { decrypt } from "../../lib/encryption";
import { api, internal } from "../_generated/api";
import { action } from "../_generated/server";

export const getVapiSecrets = action({
  args: {
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    const plugin = await ctx.runQuery(
      internal.system.plugins.getByOrganizationIdAndService,
      {
        organizationId: args.organizationId,
        service: "vapi",
      }
    );
    if (!plugin) {
      return null;
    }

    const secrets: any = await ctx.runQuery(
      api.private.secrets.getSecrets,
      {
        secretsId: plugin.secretsId,
      }
    );

    if (!secrets) {
      return null;
    }
    if (!secrets.key.privateKey || !secrets.key.publicKey) {
      return null;
    }

    // const decryptedPublicKey = decrypt(
    //   JSON.parse(secrets.key.publicKey),
    //   process.env.ENCRYPTION_KEY!
    // );

    return {
      publicKey: secrets.key.publicKey,
    };
  },
});
