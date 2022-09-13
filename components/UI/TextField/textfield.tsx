import { FormLabel, Input, Stack, Button, Text } from "@chakra-ui/react";
import { InputGroup, InputRightElement } from "@chakra-ui/react";

import { useState } from "react";

interface ITextField {
	onChange: (e: any) => void;
	placeholder: string;
	label?: string;
	error?: string;
	value?: string | number;
	type: string;
	disabled?: boolean;
	invalid?: boolean;
}

export const TextField = ({
	onChange,
	placeholder,
	label,
	error,
	invalid,
	disabled,
	value,
	type,
}: ITextField) => {
	const [show, setShow] = useState(false);
	const handleClick = () => setShow(!show);

	return (
		<Stack>
			<FormLabel fontSize={"16px"} fontWeight={600}>
				{label}
			</FormLabel>
			<InputGroup size="md">
				<Input
					height={"50"}
					isInvalid={invalid}
					errorBorderColor="red.300"
					placeholder={placeholder}
					isDisabled={disabled}
					value={value}
					focusBorderColor="purple.300"
					type={type === "password" ? (show ? "text" : "password") : type}
					onChange={onChange}
				/>
				{type === "password" && (
					<InputRightElement width="4.5rem" mt="1">
						<Button h="2rem" size="sm" onClick={handleClick}>
							{show ? "Hide" : "Show"}
						</Button>
					</InputRightElement>
				)}
			</InputGroup>
			{error && (
				<Text color={"red.200"} fontSize="12px" fontWeight={"500"}>
					{error}
				</Text>
			)}
		</Stack>
	);
};
