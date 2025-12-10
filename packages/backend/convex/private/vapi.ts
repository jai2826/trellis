import { Vapi, VapiClient } from "@vapi-ai/server-sdk";
import { ConvexError } from "convex/values";
// import { decrypt } from "../../lib/encryption";
import { api, internal } from "../_generated/api";
import { action } from "../_generated/server";

// export const getPhoneNumbers = action({
//   args: {},
//   handler: async (ctx, args) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (identity === null) {
//       throw new ConvexError({
//         code: "UNAUTHORIZED",
//         message: "Identity not found",
//       });
//     }
//     const orgId = identity.orgId as string;
//     if (orgId === null) {
//       throw new ConvexError({
//         code: "UNAUTHORIZED",
//         message: "Organization not found",
//       });
//     }

//     const plugin = await ctx.runQuery(
//       internal.system.plugins.getByOrganizationIdAndService,
//       {
//         organizationId: orgId,
//         service: "vapi",
//       }
//     );

//     if (!plugin) {
//       throw new ConvexError({
//         code: "NOT_FOUND",
//         message: "Plugin not found",
//       });
//     }

//     const secrets = await ctx.runQuery(
//       api.private.secrets.getSecrets,
//       {
//         secretsId: plugin.secretsId,
//       }
//     );

//     if (
//       !secrets?.key.privateKey ||
//       !secrets?.key.publicKey
//     ) {
//       throw new ConvexError({
//         code: "NOT_FOUND",
//         message:
//           "Credentials incomplete. Please reconnect your Vapi account.",
//       });
//     }

//     // const decryptedPrivateKey = decrypt(
//     //   JSON.parse(secrets.key.privateKey),
//     //   process.env.ENCRYPTION_KEY!
//     // );
//     const vapiClient = new VapiClient({
//       token: secrets.key.privateKey,
//     });

//     const assistants = await vapiClient.assistants.list();
//     return assistants;
//   },
// });
export const getAssistants = action({
  args: {},
  handler: async (ctx, args): Promise<Vapi.Assistant[]> => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity not found",
      });
    }
    const orgId = identity.orgId as string;
    if (orgId === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Organization not found",
      });
    }

    const plugin = await ctx.runQuery(
      internal.system.plugins.getByOrganizationIdAndService,
      {
        organizationId: orgId,
        service: "vapi",
      }
    );

    if (!plugin) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Plugin not found",
      });
    }
    const secrets = await ctx.runQuery(
      api.private.secrets.getSecrets,
      {
        secretsId: plugin.secretsId,
      }
    );

    if (
      !secrets?.key.privateKey ||
      !secrets?.key.publicKey
    ) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message:
          "Credentials incomplete. Please reconnect your Vapi account.",
      });
    }
    // const decryptedPrivateKey = decrypt(
    //   JSON.parse(secrets.key.privateKey),
    //   process.env.ENCRYPTION_KEY!
    // );
    const vapiClient = new VapiClient({
      token: secrets.key.privateKey,
    });

    const assistants = await vapiClient.assistants.list();
    return assistants;
  },
});
export const getPhoneNumbers = action({
  args: {},
  handler: async (ctx, args): Promise<Vapi.ListPhoneNumbersResponseItem[]> => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity not found",
      });
    }
    const orgId = identity.orgId as string;
    if (orgId === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Organization not found",
      });
    }

    const plugin = await ctx.runQuery(
      internal.system.plugins.getByOrganizationIdAndService,
      {
        organizationId: orgId,
        service: "vapi",
      }
    );

    if (!plugin) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Plugin not found",
      });
    }
    const secrets = await ctx.runQuery(
      api.private.secrets.getSecrets,
      {
        secretsId: plugin.secretsId,
      }
    );

    if (
      !secrets?.key.privateKey ||
      !secrets?.key.publicKey
    ) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message:
          "Credentials incomplete. Please reconnect your Vapi account.",
      });
    }
  
    const vapiClient = new VapiClient({
      token: secrets.key.privateKey,
    });

    const phoneNumbers = await vapiClient.phoneNumbers.list();
    return phoneNumbers;
  },
});
