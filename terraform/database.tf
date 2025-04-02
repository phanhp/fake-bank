resource "aws_db_subnet_group" "db-subnet-group" {
  subnet_ids = [aws_subnet.subnet-a.id, aws_subnet.subnet-b.id]
  description = "rs-${terraform.workspace}-db-subnet-group"
  tags = {
    env = "rs-${terraform.workspace}"
  }
}

resource "aws_db_parameter_group" "no-ssl-db-config" {
  count = 1
  name   = "rs-${terraform.workspace}-db-config"
  family = "postgres17"

  parameter {
    name = "rds.force_ssl"
    value = "0"
  }
}

resource "aws_db_instance" "db-instance" {
  count = terraform.workspace == "prod" ? 0 : 1
  instance_class = "db.t3.small"
  db_name = "loc8${terraform.workspace}"
  identifier = "loc8-${terraform.workspace}"
  username = "loc8${terraform.workspace}"
  password = "loc8${terraform.workspace}123456"
  allocated_storage = 5
  vpc_security_group_ids = [aws_security_group.default-sg.id]
  db_subnet_group_name = aws_db_subnet_group.db-subnet-group.name
  engine = "Postgres"
  engine_version = "17.2"
  parameter_group_name   = aws_db_parameter_group.no-ssl-db-config[count.index].name
  multi_az = false
  skip_final_snapshot = true
  publicly_accessible = true
      lifecycle {
    ignore_changes = [
      engine_version,
    ]
  }
  tags = {
    env = "rs-${terraform.workspace}"
  }
}

resource "aws_ssm_parameter" "db-name" {
  count = terraform.workspace == "prod" ? 0 : 1
  name  = "/rs/${terraform.workspace}/db/name"
  type  = "String"
  value = aws_db_instance.db-instance[count.index].db_name
  tags = {
    env = "rs-${terraform.workspace}"
  }
  overwrite = true
}

resource "aws_ssm_parameter" "db-hostname" {
  count = terraform.workspace == "prod" ? 0 : 1
  name  = "/loc8/${terraform.workspace}/db/hostname"
  type  = "String"
  value = aws_db_instance.db-instance[count.index].address
  tags = {
    env = "loc8-${terraform.workspace}"
  }
  overwrite = true
}

resource "aws_ssm_parameter" "db-hostname-reader" {
  count = terraform.workspace == "prod" ? 0 : 1
  name  = "/loc8/${terraform.workspace}/db/hostname-reader"
  type  = "String"
  value = aws_db_instance.db-instance[count.index].address
  tags = {
    env = "loc8-${terraform.workspace}"
  }
  overwrite = true
}

resource "aws_ssm_parameter" "db-username" {
  count = terraform.workspace == "prod" ? 0 : 1
  name  = "/loc8/${terraform.workspace}/db/username"
  type  = "String"
  value = aws_db_instance.db-instance[count.index].username
  tags = {
    env = "loc8-${terraform.workspace}"
  }
  overwrite = true
}

resource "aws_ssm_parameter" "db-password" {
  count = terraform.workspace == "prod" ? 0 : 1
  name  = "/loc8/${terraform.workspace}/db/password"
  type  = "String"
  value = aws_db_instance.db-instance[count.index].password
  tags = {
    env = "loc8-${terraform.workspace}"
  }
  overwrite = true
}
