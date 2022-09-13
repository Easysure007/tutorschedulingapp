import React from "react";
import { BiDotsHorizontalRounded } from "react-icons/bi";
interface ITable {
	title: string;
	titleButton: any;
	disabled?: boolean;
	onClick: () => void;
	data: [];
	tableHeader: string[];
}
export default function TableDiv({
	title,
	titleButton,
	onClick,
	disabled,
	data,
	tableHeader,
}: ITable) {
	return (
		<>
			<div style={{ border: "1px solid #ededf2", borderRadius: "10px" }}>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						padding: "12px 16px 6px 16px",
					}}
				>
					<div>
						<p className="w-800">{title}</p>
					</div>
					<button
						onClick={onClick}
						disabled={disabled}
						style={{
							border: "none",
							width: "150px",
							height: "45px",
							background: "#301934",
							color: "white",
							borderRadius: "10px",
						}}
					>
						{titleButton}
					</button>
				</div>
				<div>
					<table className="table">
						<tr className="tableHeader">
							{tableHeader.map((item) => (
								<td>
									<p className="blue">{item}</p>
								</td>
							))}
						</tr>
						{["", ""].map(() => (
							<>
								<tr className="tableRow">
									<td>
										<p className="blue">King ray</p>
									</td>
									<td>
										<p className="blue">King ray</p>
									</td>
									<td>
										{" "}
										<p className="blue">King ray</p>
									</td>
									<td>
										{" "}
										<p className="blue">King ray</p>
									</td>
									<td>
										<BiDotsHorizontalRounded color="#cecede" size={"26"} />
									</td>
								</tr>
							</>
						))}
					</table>
				</div>
			</div>
		</>
	);
}
