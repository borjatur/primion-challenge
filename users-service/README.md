## Commands
grpcurl -vv -plaintext -proto users-service/node_modules/proto/user.proto localhost:50053 describe
grpcurl -vv -plaintext -d '{"id": 1}' -proto users-service/node_modules/proto/user.proto localhost:50053 user.UserService/GetUserById