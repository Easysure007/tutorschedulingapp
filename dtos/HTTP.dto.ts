interface HTTPDTO {
    message: string
    status: number;
}

export interface HTTPErrorDTO extends HTTPDTO {
    error: Array<string> | string;
}

export interface HTTPSuccessDTO extends HTTPDTO {
    data: any
}