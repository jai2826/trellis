import {
	contactSessionIdAtomFamily,
	errorMessageAtom,
	loadingMessageAtom,
	organizationIdAtom,
	screenAtom,
} from "@/modules/widget/atoms/widget-atoms";
import { WidgetHeader } from "@/modules/widget/ui/components/widget-header";
import { api } from "@workspace/backend/convex/_generated/api";
import { useAction, useMutation } from "convex/react";
import { useAtomValue, useSetAtom } from "jotai";
import { LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";

type InitStep =
	| "storage"
	| "org"
	| "session"
	| "settings"
	| "vapi"
	| "done";

export const WidgetLoadingScreen = ({
	organizationId,
}: {
	organizationId: string | null;
}) => {
	const [step, setStep] = useState<InitStep>("org");
	const [sessionValid, setSessionValid] = useState(false);

	const setScreen = useSetAtom(screenAtom);
	const setOrganizationId = useSetAtom(organizationIdAtom);
	const loadingMessage = useAtomValue(loadingMessageAtom);
	const setErrorMessage = useSetAtom(errorMessageAtom);
	const setLoadingMessage = useSetAtom(loadingMessageAtom);

	const contactSessionId = useAtomValue(
		contactSessionIdAtomFamily(organizationId || "")
	);
	// Step 1: Validate organization ID
	const validateOrganization = useAction(
		api.public.organizations.validate
	);
	useEffect(() => {
		if (step !== "org") return;
		setLoadingMessage("Finding organization ID...");
		if (!organizationId) {
			setErrorMessage("Organization ID is required");
			setScreen("error");
			return;
		}
		setLoadingMessage("Verifying organization...");
		validateOrganization({ organizationId })
			.then((res) => {
				if (res.valid) {
					setOrganizationId(organizationId);
					setStep("session");
				} else {
					setErrorMessage(
						res.reason || "Invalid configuration"
					);
					setScreen("error");
				}
			})
			.catch(() => {
				setErrorMessage("Unable to verify organization");
				setScreen("error");
			});
	}, [
		step,
		organizationId,
		setErrorMessage,
		setScreen,
		setOrganizationId,
		setStep,
		validateOrganization,
		setLoadingMessage,
	]);

	// Step 2: Validate session (if exhists)
	const validateContactSession = useMutation(
		api.public.contactSessions.validate
	);
	useEffect(() => {
		if (step !== "session") return;
		setLoadingMessage("Finding contact session ID...");
		if (!contactSessionId) {
			setSessionValid(false);
			setStep("done");
			return;
		}
		setLoadingMessage("Validating session...");

		validateContactSession({
			contactSessionId,
		})
			.then((result) => {
				setSessionValid(result.valid);
				setStep("done");
			})
			.catch(() => {
				setSessionValid(false);
				setStep("done");
			});
	}, [
		step,
		setLoadingMessage,
		validateContactSession,
		contactSessionId,
	]);

	useEffect(() => {
		if (step !== "done") return;
		const hasVailSession = contactSessionId && sessionValid;
		setScreen(hasVailSession ? "selection" : "auth");
	}, [step, contactSessionId, sessionValid, setScreen]);

	return (
		<>
			<WidgetHeader>
				<div className="flex flex-col justify-between gap-y-2 px-2 py-6 font-semibold">
					<p className="text-3xl">Hi there! </p>
					<p className="text-lg">
						Let&apos;s get you started
					</p>
				</div>
			</WidgetHeader>
			<div className="flex flex-1 flex-col text-muted-foreground items-center justify-center gap-y-4 p-4">
				<LoaderIcon className="animate-spin" />
				<p className="text-sm">
					{loadingMessage || "Loading..."}
				</p>
			</div>
		</>
	);
};
