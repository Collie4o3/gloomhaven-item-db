import React, { ChangeEvent, useCallback, useState } from "react";
import { Button, Form, List, Modal } from "semantic-ui-react";
import { useFirebase } from "../../Firebase";

type Props = {
	isOpen: boolean;
	onClose: () => void;
};

export const SignInDialog = (props: Props) => {
	const { isOpen, onClose } = props;
	const { firebase } = useFirebase();
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [error, setError] = useState<Error | null>(null);

	const onSubmit = useCallback(
		(event: any) => {
			if (!firebase) return;

			firebase
				.doSignInWithEmailAndPassword(email, password)
				.then(() => {
					setEmail("");
					setPassword("");
					setError(null);
				})
				.catch((error) => {
					setError(error);
				});

			event.preventDefault();
		},
		[firebase, email, password]
	);

	const isInvalid = password === "" || email === "";
	return (
		<Modal size="tiny" open={isOpen} onClose={onClose}>
			<Modal.Header>Sign In</Modal.Header>
			<Modal.Content>
				<Form onSubmit={onSubmit}>
					<List>
						<List.Item>
							<Form.Input
								name="email"
								value={email}
								onChange={(e: ChangeEvent<HTMLInputElement>) =>
									setEmail(e.target.value)
								}
								type="text"
								placeholder="Email Address"
							/>
						</List.Item>
						<List.Item>
							<Form.Input
								name="passwordOne"
								value={password}
								onChange={(e: ChangeEvent<HTMLInputElement>) =>
									setPassword(e.target.value)
								}
								type="password"
								placeholder="Password"
							/>
						</List.Item>
						<List.Item>
							{error && <Form.Field>{error.message}</Form.Field>}
						</List.Item>
					</List>
				</Form>
			</Modal.Content>
			<Modal.Actions>
				<Button negative onClick={onClose}>
					Close
				</Button>
				<Button
					disabled={isInvalid}
					positive
					icon="checkmark"
					labelPosition="right"
					content="Sign In"
					onClick={onSubmit}
				/>
			</Modal.Actions>
		</Modal>
	);
};
