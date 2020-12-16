interface PooAppRequest {
    getBody();
    validate(): boolean;
    clean();
}
